import { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const decodedDirname = decodeURIComponent(__dirname);

console.log("======================================");
console.log(`|| DETECTED ${process.env.NODE_ENV} ENVIRONMENT ||`);
console.log("======================================");

const env = process.env.NODE_ENV || "development";

const knexConfig: Knex.Config = {
  client: "postgresql",
  connection: {
    host:
      env === "production"
        ? process.env.NEON_PROD_DB_HOST
        : process.env.KNEX_LOCAL_DB_HOST,
    database:
      env === "production"
        ? process.env.NEON_PROD_DB_NAME
        : process.env.KNEX_LOCAL_DB_NAME,
    user:
      env === "production"
        ? process.env.NEON_PROD_DB_USER
        : process.env.KNEX_LOCAL_DB_USER,
    password:
      env === "production"
        ? process.env.NEON_PROD_DB_PASSWORD
        : process.env.KNEX_LOCAL_DB_PASSWORD,
    port: 5432,
    ...(env === "production" && {
      ssl: {
        rejectUnauthorized: false, // This bypasses the SSL warning for production DB calls
      },
    }),
  },
  pool: { min: 0, max: 10 },
  migrations: {
    directory: path.join(decodedDirname, "../dist/db/migrations"),
    tableName: "knex_migrations",
  },
  seeds: {
    directory: path.join(
      decodedDirname,
      "../dist/db/seeds",
      process.env.NODE_ENV === "staging" ? "staging" : "development"
    ),
  },
};

export default knexConfig;
