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

# GraphQL

## Run the GraphQL Serer

`cd` to `kettlepal/backend/graphql-server`, then run `npm start`
You can now open `http://localhost:4000/` in the browser to use Apollo Server to test your GQL layer.

NOTE: The server does _not_ hot reload. I think "codemon" is a tool that can do this?
