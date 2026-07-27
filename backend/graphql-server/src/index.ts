import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import resolvers from "./resolvers.js";
import pkg from "jsonwebtoken";
import {
  AuthenticatedRequest,
  TokenPayload,
  refreshTokens,
} from "./utils/auth.js";
import { Response, NextFunction, Request } from "express";
const { verify } = pkg;
import knex from "knex";
import { allowedOrigins, backendURL } from "./utils/urls.js";
import { readFileSync } from "fs";
import knexConfig from "./knexfile.js";

const app = express();

// Trust the first proxy hop (Render). Without this, express-rate-limit
// sees every request as coming from the load balancer and a single bot
// could exhaust the bucket for everyone else.
app.set("trust proxy", 1);

// A simple ping endpoint to help keep the production application
// from sleeping, with the help of UptimeRobot.
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// CORS configuration
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

const httpServer = http.createServer(app);

// Add cookie-parser middleware
app.use(cookieParser());

// Add JSON-parsing middleware
app.use(bodyParser.json());

// JWT verification middleware
const jwtMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];

    // Need to re-authenticate when the client doesn't have any tokens
    if (accessToken === undefined && refreshToken === undefined) {
      return next();
    }

    if (
      process.env.ACCESS_TOKEN_SECRET === undefined ||
      process.env.REFRESH_TOKEN_SECRET === undefined
    ) {
      return next();
    }

    // Verify the access token hasn't been tampered with. Undefined when it expires.
    let accessTokenData;
    if (accessToken !== undefined) {
      accessTokenData = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      ) as TokenPayload;
    }

    // Verify the refresh token hasn't been tampered with
    const refreshTokenData = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as TokenPayload;

    // Check the user hasn't logged out
    const knexInstance = knex(knexConfig);
    const user = await knexInstance("users")
      .where({ uid: refreshTokenData.userUid })
      .first();
    if (!user || user.tokenCount !== refreshTokenData.tokenCount) {
      throw new Error("Invalid token");
    }

    // Issue a new tokens immediately and provide GQL context for current request.
    if (accessToken === undefined) {
      try {
        const result = await refreshTokens(req, res);
        if (result?.success && user.uid) {
          // Place the userUid on the request so we can access it in GQL
          req.userUid = user?.uid;
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log("Error issuing new access token: ", e.message);
        } else {
          console.log("Unknown error issuing new access token:", e);
        }
      }
      // Didn't need to generate a new access token, so we can grab it from the JWT
    } else {
      req.userUid = accessTokenData?.userUid ?? refreshTokenData?.userUid;
    }

    // Token was tampered with, or refresh token expired.
  } catch (e) {
    console.log(`JWT Authentication Error: ${e}`);
    // Clear the tokens immediately rather than waiting for token timeout
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
  }
  next();
};

app.use(jwtMiddleware);

const typeDefs = readFileSync("./src/schema.graphql", { encoding: "utf-8" });

// Extend Express server with Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return error;
  },
});

async function startApolloServer() {
  await server.start();

  // CSRF defense — reject mutations whose Origin header doesn't match a
  // trusted frontend. SameSite=Lax on the cookies already blocks the
  // cross-site POST vector at the browser, but this guard catches anything
  // that ever finds a way around that (older browsers, custom clients,
  // future regressions). Reads are intentionally unrestricted — they don't
  // mutate state and were never the CSRF concern.
  app.use(
    "/graphql",
    (
      req: Request,
      _res: Response,
      next: (err?: unknown) => void
    ): void => {
      // GraphQL request bodies are JSON-parsed by bodyParser above, so
      // req.body.query exists for any well-formed request.
      const query: string | undefined = req.body?.query;
      const isMutation =
        typeof query === "string" && query.trimStart().startsWith("mutation");
      if (!isMutation) {
        return next();
      }

      // No Origin header: same-origin browser requests and most non-browser
      // callers. Both are safe — browsers always send Origin on cross-site
      // POSTs, so a missing header means the request isn't a cross-site
      // attack.
      const originHeader = req.headers.origin;
      if (!originHeader) {
        return next();
      }

      if (allowedOrigins.includes(originHeader)) {
        return next();
      }

      // Rejecting here bypasses Apollo — write the GraphQL-shaped response
      // directly so the FE sees the same error envelope as any other
      // resolver-side throw.
      _res.status(403).json({
        errors: [
          {
            message: `Cross-origin mutation from ${originHeader} is not allowed.`,
            extensions: { code: "FORBIDDEN" },
          },
        ],
      });
    }
  );
  // Rate limiting — applied per-IP, per-operation name. Auth-touching
  // mutations get a tight bucket; everything else gets a generous one.
  // Skipped entirely in non-production so dev tooling / scripts aren't
  // throttled. In-memory store means limits are per-instance, which is
  // acceptable for a single Render service.
  const isProduction = process.env.NODE_ENV === "production";

  // Operations that touch credentials, sessions, or admin-only reads.
  // These need the tightest bucket — credential stuffing and account
  // enumeration are the highest-impact abuse cases against this API.
  const AUTH_OPERATIONS = new Set<string>([
    "login",
    "signUp",
    "resetPassword",
    "invalidateToken",
    "refreshToken",
    "users",
  ]);

  if (isProduction) {
    const authLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      limit: 5, // 5 attempts per minute per IP per operation
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: {
        errors: [{ message: "Too many auth requests, please slow down." }],
      },
    });
    const defaultLimiter = rateLimit({
      windowMs: 60 * 1000,
      limit: 60, // 60 req/min/IP/operation for ordinary traffic
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: {
        errors: [
          { message: "Too many requests, please slow down." },
        ],
      },
    });

    // Dispatcher: pull the GraphQL operation name off the parsed body and
    // hand the request to the matching limiter. Body parsing happens before
    // we get here (see `bodyParser.json()` above), so `req.body?.operationName`
    // is populated. Anonymous queries (no operationName) fall through to the
    // default bucket — they're rare and Apollo will reject malformed ones.
    app.use("/graphql", (req: Request, res: Response, next: NextFunction) => {
      const operationName: string | undefined = req.body?.operationName;
      const limiter =
        operationName && AUTH_OPERATIONS.has(operationName)
          ? authLimiter
          : defaultLimiter;
      limiter(req, res, next);
    });
  }

  // Set up GraphQL endpoint with CORS, Apollo middleware, and user context
  app.use(
    "/graphql",
    cors(corsOptions),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        userUid: (req as any).userUid,
        userData: (req as any).userData,
      }),
    })
  );

  // Finally, start the server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at ${backendURL()}`);
}

startApolloServer().catch((err) => {
  console.error("Error starting server:", err);
});
