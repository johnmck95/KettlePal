# Database

## Migrations

Navigate to the `kettlepal/backend/graphql-server` directory.

- Make a new migration with `knex migrate:make migration_name`, this will be stored in `src/db/migrations`.
- View the queue of migrations with `knex migrate:list`
- Run the next migration with `knex migrate:up`, `:down` or `:latest`
- Run a specific migration with `knex migrate:<up or down> <migration_file_name.js>`

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

# Tables

There are 3 important KettlePal postgresql tables.

There is a `1 - M` relationship between the `users & workouts` tables, and another `1 - M` relationship between the `workouts & exercises` tables.

## users

<table border="1" cellspacing="0" cellpadding="4">
  <thead>
    <tr>
      <th>uid</th>
      <th>first_name</th>
      <th>last_name</th>
      <th>email</th>
      <th>password</th>
      <th>is_authorized</th>
      <th>created_at</th>
      <th>token_count</th>
      <th>bodyWeight</th>
      <th>bodyWeightUnit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>primary key</td>
      <td>first name</td>
      <td>last name</td>
      <td>email</td>
      <td>the hashed user password</td>
      <td>A flag to restrict/grant access in the future</td>
      <td>the date the account was created</td>
      <td>used in validation</td>
      <td>the weight of the user, 0 by default or if the user would not like to say</td>
      <td>the unit of the users body weight, "lb" or "kg"</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td>varchar(255)</td>
      <td>varchar(255)</td>
      <td>varchar(255)</td>
      <td>varchar(255)</td>
      <td>boolean</td>
      <td>timestamptz</td>
      <td>int(4)</td>
      <td>float(4)</td>
      <td>text enum ["lb", "kg"]</td>
    </tr>
     <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>nullable</td>
      <td>nullable</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

## workouts

<table border="1" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th>uid</th>
      <th>user_uid</th>
      <th>date</th>
      <th>created_at</th>
      <th>elapsed_seconds</th>
      <th>comment</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>primary key</td>
      <td>foreign key</td>
      <td>the date the workout occurred on. Naively supports single timezone</td>
      <td>the date the workout was first saved to the db</td>
      <td>total number of seconds the workout lasted for</td>
      <td>comment</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td>uuid</td>
      <td>varchar(255). EX: 'YYYY-MM-DD'</td>
      <td>timestamptz</td>
      <td>int(4)</td>
      <td>varchar(512)</td>
    </tr>
        <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>nullable</td>
      <td>nullable</td>
    </tr>
  </tbody>
</table>

## exercises

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>uid</th>
      <th>workout_uid</th>
      <th>title</th>
      <th>created_at</th>
      <th>weight</th>
      <th>weight_unit</th>
      <th>sets</th>
      <th>reps</th>
      <th>reps_display</th>
      <th>elapsed_seconds</th>
      <th>comment</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>primary key</td>
      <td>foreign key</td>
      <td>name of the exercise performed</td>
      <td>the date the exercise was first saved to the db</td>
      <td>
        the numerical value of weight of the exercise equipment. Ex: "32" for a 32kg kettlebell. 
        Or "225" for a 225lb barbell. Not applicable for all exercises (like pull-ups).
      </td>
      <td>The unit for the weight. Typically "kg" or "lb" if applicable.</td>
      <td>The number of sets the exercise was performed for</td>
      <td>
        The <em>total</em> number of reps the exercise was performed for, <em>per set</em>. 
        If reps are done on each side, EX: 3 sets x (5 presses left arm, 5 presses right arm), reps = 10.
      </td>
      <td>
        The method the UI will use to display the total number of reps to the user. 
        'std' (standard reps, like a goblet squat), 'l/r' (reps done separately on the left/right, like turkish get ups), 
        '(1,2,3,4,5)', '(1,2,3,4)', '(1,2,3)', '(1,2)' – for Kettlebell Ladders respectively.
      </td>
      <td>total number of seconds the exercise lasted for</td>
      <td>comment</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td>uuid</td>
      <td>varchar(255)</td>
      <td>timestamptz</td>
      <td>float(4)</td>
      <td>varchar(255)</td>
      <td>int(4)</td>
      <td>int(4)</td>
      <td>varchar(255)</td>
      <td>int(4)</td>
      <td>varchar(512)</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>nullable</td>
      <td>nullable</td>
      <td>nullable</td>
      <td>nullable</td>
      <td>nullable</td>
      <td>nullable</td>
      <td>nullable</td>
    </tr>
  </tbody>
</table>

## templates

<table border="1" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th>uid</th>
      <th>user_uid</th>
      <th>created_at</th>
      <th>title</th>
      <th>weight_unit</th>
      <th>multiplier</th>
      <th>reps_display</th>
      <th>index</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>primary key</td>
      <td>foreign key</td>
      <td>the date the exercise template was created on</td>
      <td>exercise title</td>
      <td>the weight unit, either "kg" or "lb" if applicable (users.bodyWeightUnit will be used for body weight exercises)</td>
      <td>for body weight exercises, this multiplier will be used to computer work capacity. Ex: Pull Up may be 0.90 * body mass, where 0.90 is the multipler.</td>
      <td>The method the UI will use to display the total number of reps to the user. See exercises.reps_display for full details.</td>
      <td>The 0-based index the exercise templates should appear in an ordered list (new workout page dropdown)</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td>uuid</td>
      <td>timestamptz</td>
      <td>varchar(255)</td>
      <td>varchar(255)</td>
      <td>float(4)</td>
      <td>varchar(255)</td>
      <td>int(4)</td>
    </tr>
        <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>nullable</td>
      <td>nullable</td>
      <td>nullable</td>
      <td></td>
    </tr>
  </tbody>
</table>
