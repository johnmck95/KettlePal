# Database

## Connect to PostgreSQL from Terminal

- At the root, run `psql postgres://johnmckinnon@localhost:5432/[db name]`
- Run `\q` to quit out of the database.
- Next time, you should be able to reconnect simply with `psql`

If you try to connect through the terminal and the connection fails, open to postgres app and make sure the app is actually running. In the app you can hit `Start` or `Stop` accordingly.

## Connect to PostgreSQL in TablePlus

There are two local databases: `kettlepal-stage` & `kettlepal-dev`, both are accessed via localhost port 5432.

## Cloning kettlepal-stage to kettlepal-dev

There are currently two local databases, `kettlepal-stage` & `kettlepal-dev`.

To make `kettlebell-dev` have an identical schema & data as `kettlepal-stage`, run `npm run restore_kettlepal-dev`. This will drop the `kettlepal-dev` database, pg_dump the contents of `kettlepal-stage`, then create a new `kettlepal-dev` DB with the dumped data. Finally, it removes the data dump file.

## Migrations

- Make a new migration with `knex migrate:make migration_name`, this will be stored in `src/db/migrations`.
- See the docs for various up/down/latest.. commands. https://knexjs.org/guide/migrations.html#migration-cli

## Seeds

- Make a new Seed file with `knex seed:make table_name`, this will be stored in `src/db/seeds`.
- Run the particular seeding file with `knex seed:make name`

# GraphQL

## Run the GraphQL Server

`cd` to `kettlepal/backend/graphql-server`, then run `npm start`
You can now open `http://localhost:4000/` in the browser to use Apollo Server to test your GQL layer.

NOTE: The server does _not_ hot reload. I think "codemon" is a tool that can do this?

## Selecting the Database

`knexfile.ts` in _/backend/graphql-server/src_ contains the `knexConfig` required for defining the DB connection. It uses env variables to choose to corresponding DB. Update these env variables to change the DB you are pointing to.
