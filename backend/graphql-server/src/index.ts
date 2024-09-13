import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import pkg from "jsonwebtoken";
import { refreshTokens } from "./utils/auth.js";
const { verify } = pkg;
import knexConfig from "../knexfile.js";
import knex from "knex";
import { allowedOrigins, backendURL } from "./utils/urls.js";

const app = express();

// CORS configuration
const corsOptions = {
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
const jwtMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];

    // Need to re-authenticate when the client doesn't have any tokens
    if (accessToken === undefined && refreshToken === undefined) {
      return next();
    }

    // Verify the access token hasn't been tampered with. Undefined when it expires.
    let accessTokenData;
    if (accessToken !== undefined) {
      accessTokenData = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    }

    // Verify the refresh token hasn't been tampered with
    const refreshTokenData = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Check the user hasn't logged out
    const knexInstance = knex(knexConfig);
    const user = await knexInstance("users")
      .where({ uid: refreshTokenData.userUid })
      .first();
    if (!user || user.tokenCount !== refreshTokenData.tokenCount) {
      console.log("Throwing invalid token");
      throw new Error("Invalid token");
    }

    // Issue a new tokens immediately and provide GQL context for current request.
    if (accessToken === undefined) {
      try {
        const result = await refreshTokens(req, res);
        if (result.success && user.uid) {
          // Place the userUid on the request so we can access it in GQL
          req.userUid = user?.uid;
        }
      } catch (e) {
        console.log("Error issuing new access token: ", e.message);
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
