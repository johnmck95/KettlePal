import knex from "knex";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
// Decode the directory path to handle encoded characters like '%20' (spaces)
const decodedDirname = decodeURIComponent(__dirname);

const knexConfig = {
  client: "postgresql",
  connection: {
    host: "localhost",
    database:
      process.env.NODE_ENV === "development"
        ? "kettlepal-dev"
        : "kettlepal-stage",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(decodedDirname, "./src/db/migrations"),
    tableName: "knex_migrations",
  },
  seeds: {
    directory: path.join(
      decodedDirname,
      "./src/db/seeds",
      process.env.NODE_ENV === "development" ? "development" : "staging"
    ),
  },
};

export default knexConfig;
