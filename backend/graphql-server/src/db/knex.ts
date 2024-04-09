import knexConfig from "../../knexfile";
import knex from "knex";

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];
export default knex(config);
