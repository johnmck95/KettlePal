## Connect to PostgreSQL from Terminal

At the root, run `psql postgres://johnmckinnon@localhost:5432/johnmckinnon`
run `\q` to quit out of the database.
next time, you should be able to reconnect simply with `psql`

If you try to connect through the terminal and the connection fails, open to postgres app and make sure the app is actually running.
In the app you can hit `Start` or `Stop` accordingly.

## Connect to PostgreSQL in TablePlus

TablePlus connects with the PostgreSQL via the `KettlePal` conection. You can then hit Cmmd + K to connect to the `johnmckinnon` DB.
In the future, you may want to make your own DB connection.
