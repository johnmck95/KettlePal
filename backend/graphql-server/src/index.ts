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

    if (accessToken) {
      // verify the tokens being received from client have not been tampered with
      const accessTokenData = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const refreshTokenData = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Place the userUid from the access token on the request so we can access it in GQL
      req.userUid = accessTokenData.userUid;

      const knexInstance = knex(knexConfig);
      const user = await knexInstance("users")
        .where({ uid: accessTokenData.userUid })
        .first();

      // If tokenCount doesn't match, we've expired the token. Need to refresh/re-authenticate.
      if (!user || user.tokenCount !== refreshTokenData.tokenCount) {
        throw new Error("Invalid token");
      }
    }
  } catch (e) {
    // Access-token likely expired, try to refresh tokens
    try {
      const result = await refreshTokens(req, res);
      if (!result.success) {
        res.clearCookie("access-token");
        res.clearCookie("refresh-token");
      }
    } catch (e) {
      console.log(`Error refreshing tokens: ${e}`);
    }
  }
  next();
};

app.use(jwtMiddleware);

// Extend Express server with Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
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
