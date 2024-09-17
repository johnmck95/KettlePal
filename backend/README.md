# Database

## Migrations

- Make a new migration with `knex migrate:make migration_name`, this will be stored in `src/db/migrations`.
- Run your migration with `knex migrate:up`, `:down` or `:latest`

## Seeds

- Make a new Seed file with `knex seed:make table_name`, this will be stored in `src/db/seeds`. IF THIS SEED FILENAME ALREADY EXISTS, IT WILL OVERWRITE THE FILE! You've been warned.
- Run the seeding with `knex seed:run`, or a specific seed file with `knex seed:run --specific=filename.js`
- Note the table dependencies are ordered as such: Users -> Workouts -> Exercises

# GraphQL

## Run the GraphQL Server

`cd` to `kettlepal/backend/graphql-server`, then run `npm start`
You can now open `http://localhost:4000/graphql` in the browser to use Apollo Server to test your backend server.

NOTE: The server does _not_ hot reload. TODO.

## Selecting the Database

`knexfile.ts` in _/backend/graphql-server/src_ contains the `knexConfig` required for defining the DB connection. It uses env variables to choose to corresponding DB. Update these env variables to change the DB you are pointing to.

## Cloning kettlepal-prod to kettlepal-dev

To make `kettlebell-dev` have an identical schema & data as `kettlepal-prod`, run `npm run restore_kettlepal-dev`. This will drop the `kettlepal-dev` database, pg_dump the contents of `kettlepal-prod`, then create a new `kettlepal-dev` DB with the dumped data. Finally, it removes the data dump file.
