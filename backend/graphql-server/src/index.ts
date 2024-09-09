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

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://kettlepal.netlify.app",
  "https://kettlepal.onrender.com",
];

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
app.options("*", cors(corsOptions)); // Enable pre-flight requests for all routes

const httpServer = http.createServer(app);

// Add cookie-parser middleware
app.use(cookieParser());
app.use(bodyParser.json());

// JWT verification middleware
app.use(async (req: any, res, next) => {
  try {
    const accessToken = req.cookies["access-token"];

    if (accessToken) {
      // Verify the access token from the client is valid with secret
      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.userUid = data.userUid;

      // Place the userUid from the access token on the request so we can access it in GQL
      const knexInstance = knex(knexConfig);
      const user = await knexInstance("users")
        .where({ uid: data.userUid })
        .first();

      // token has been invalidated
      if (!user || user.tokenCount !== data.tokenCount) {
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
  // }
  next();
});

// Extend Express server with Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  await server.start();

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

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

startApolloServer().catch((err) => {
  console.error("Error starting server:", err);
});
