import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const knexConfig = {
  client: "pg",
  connection: {
    host: process.env.KNEX_HOST,
    user: process.env.KNEX_USER,
    password: process.env.KNEX_PASSWORD,
    database: process.env.KNEX_DATABASE,
  },
};
export default knex(knexConfig);
