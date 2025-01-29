import knexConfig from "../knexfile.js";
import knex from "knex";
import * as bcrypt from "bcrypt";
import { verifyExercises } from "./utils/verifyExercises.js";
import { verifyWorkout } from "./utils/verifyWorkout.js";
import {
  formatExercisesForDB,
  formatWorkoutForDB,
} from "./utils/formatDataForDB.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  createTokens,
  refreshTokens,
  setAccessToken,
  setRefreshToken,
} from "./utils/auth.js";
import { NotAuthorizedError } from "./utils/Errors/NotAuthorizedError.js";
import {
  AddOrEditUserInput,
  AddOrEditWorkoutInput,
  AddWorkoutWithExercisesInput,
  Exercise,
  QueryPastWorkoutsArgs,
  QueryUserArgs,
  QueryWorkoutsArgs,
  UpdateWorkoutWithExercisesInput,
  User,
  Workout,
} from "./generated/backend-types.js";
import getFuzzyWorkoutSearchResults from "./utils/Search/PastWorkoutsFuzzySearch.js";

const knexInstance = knex(knexConfig);

// Incoming Resolver Properties are: (parent, args, context)
export const resolvers = {
  // The top-level resolvers inside Query are the entry point resolvers for the graph, not nested queries like workout{ exercises{...} }
  Query: {
    async users(_, __, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("users").select("*");
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    async pastWorkouts(
      _,
      { userUid, searchQuery, limit, offset }: QueryPastWorkoutsArgs,
      { req }: any
    ) {
      if (!req.userUid || req.userUid !== userUid) {
        throw new NotAuthorizedError();
      }
      const pastWorkouts = await getFuzzyWorkoutSearchResults({
        searchQuery,
        userUid,
        knexInstance,
        limit,
        offset,
      });

      return pastWorkouts;
    },
    async user(_, { uid }: QueryUserArgs, { req }: any) {
      if (!req.userUid || req.userUid !== uid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("users")
          .select("*")
          .where({ uid: uid })
          .first();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },

    async workouts(_, { limit, offset }: QueryWorkoutsArgs, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }

      try {
        let result;
        let query = `
          SELECT *
          FROM workouts
          WHERE "userUid" = ?
          ORDER BY date::date DESC
        `;
        let params = [req.userUid];

        if (offset !== undefined) {
          query += ` OFFSET ?`;
          params.push(offset.toString());
        }

        if (limit !== undefined) {
          query += ` LIMIT ?`;
          params.push(limit.toString());
        }

        result = await knexInstance.raw(query, params);

        const workouts = result.rows;
        return workouts;
      } catch (error) {
        console.error("Error fetching workouts:", error);
        throw error;
      }
    },
    async workout(_, { uid }: { uid: String }, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("workouts")
          .select("*")
          .where({ uid: uid })
          .first();
      } catch (error) {
        console.error("Error fetching workout:", error);
        throw error;
      }
    },

    async exercises(_, __, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("exercises").select("*");
      } catch (error) {
        console.error("Error fetching exercises:", error);
        throw error;
      }
    },
    async exercise(_, { uid }: { uid: String }, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("exercises")
          .select("*")
          .where({ uid: uid })
          .first();
      } catch (error) {
        console.error("Error fetching exercises:", error);
        throw error;
      }
    },

    checkSession(_, __, { req }) {
      // Middleware is responsible for validating JWTs
      if (req.userUid) {
        const user = knexInstance("users").where({ uid: req.userUid }).first();
        return {
          isValid: true,
          user,
        };
      } else {
        return { isValid: false };
      }
    },
  },

  // Resolvers to gather nested fields within a User query (EX: User{ workouts{...} })
  User: {
    async workouts(parent: User, { limit, offset }: QueryWorkoutsArgs) {
      try {
        let result;
        let query = `
          SELECT *
          FROM workouts
          WHERE "userUid" = ?
          ORDER BY date::date DESC
        `;
        let params = [parent.uid];

        if (offset !== undefined) {
          query += ` OFFSET ?`;
          params.push(offset.toString());
        }

        if (limit !== undefined) {
          query += ` LIMIT ?`;
          params.push(limit.toString());
        }

        result = await knexInstance.raw(query, params);

        const workouts = result.rows;
        return workouts;
      } catch (error) {
        console.error("Error fetching workouts:", error);
        throw error;
      }
    },
    async userStats(parent: User) {
      try {
        return (
          await knexInstance.raw(`
            WITH workoutStats AS (
              SELECT 
                w."userUid",
                MAX(w."elapsedSeconds") AS longestWorkout,
                MAX(workoutReps.totalReps) AS mostRepsInWorkout,
                MAX(workoutCapacity.workCapacity) AS largestWorkCapacity,
                MIN(w.date) AS oldestWorkoutDate
              FROM workouts w
              LEFT JOIN (
                SELECT "workoutUid", SUM(reps) AS totalReps
                FROM exercises
                GROUP BY "workoutUid"
              ) workoutReps ON w.uid = workoutReps."workoutUid"
              LEFT JOIN (
                SELECT 
                  "workoutUid", 
                  SUM(
                    sets * reps * 
                    CASE 
                      WHEN "weightUnit" = 'lbs' THEN weight * 0.45359237
                      ELSE weight
                    END
                  ) AS workCapacity
                FROM exercises
                WHERE weight IS NOT NULL
                GROUP BY "workoutUid"
              ) workoutCapacity ON w.uid = workoutCapacity."workoutUid"
              GROUP BY w."userUid"
            ),
            favoriteExercises AS (
              SELECT 
                  w."userUid",
                  e.title,
                  COUNT(*) AS exerciseCount,
                  ROW_NUMBER() OVER (PARTITION BY w."userUid" ORDER BY COUNT(*) DESC) AS rank
                  FROM exercises e
                  JOIN workouts w ON e."workoutUid" = w.uid
                  GROUP BY w."userUid", e.title
            )
            SELECT 
              COUNT(DISTINCT w.uid) AS "totalWorkouts",
              COUNT(DISTINCT e.uid) AS "totalExercises",
              SUM(w."elapsedSeconds") AS "totalTime",
              ws.longestWorkout AS "longestWorkout",
              ws.mostRepsInWorkout AS "mostRepsInWorkout",
              ws.largestWorkCapacity AS "largestWorkCapacityKg",
              ws.oldestWorkoutDate AS "oldestWorkoutDate",
              (
                SELECT STRING_AGG(fe.title || ' (' || fe.exerciseCount || ' times)', ', ')
                FROM (
                  SELECT title, exerciseCount
                  FROM favoriteExercises
                  WHERE "userUid" = u.uid AND rank <= 10
                  ORDER BY rank
                ) fe
              ) AS "topExercises"
            FROM users u
            LEFT JOIN workouts w ON u.uid = w."userUid"
            LEFT JOIN exercises e ON w.uid = e."workoutUid"
            LEFT JOIN workoutStats ws ON u.uid = ws."userUid"
            WHERE u.uid = '${parent.uid}'
            GROUP BY u.uid, ws.longestWorkout, ws.mostRepsInWorkout, ws.largestWorkCapacity, ws.oldestWorkoutDate;
          `)
        ).rows[0];
      } catch (error) {
        console.error("Error fetching user stats:", error);
        throw error;
      }
    },
    // period: "Week" | "Month" | "Year" | "Lifetime" --> the type of data queried.
    // dateRange: "2021-01-01,2021-01-31" --> for custom date range, default is the latest. YYYY-MM-DD,YYYY-MM-DD
    async atAGlance(
      parent: User,
      {
        period,
        dateRange,
      }: { period: "Week" | "Month" | "Year" | "Lifetime"; dateRange: string }
    ) {
      function getCurrentWeek() {
        const today = new Date();
        const currentDay = today.getDay();
        const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when current day is Sunday

        const monday = new Date(today.setDate(diff));
        const sunday = new Date(today.setDate(diff + 6));

        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        return `${formatDate(monday)},${formatDate(sunday)}`;
      }

      switch (period) {
        case "Week":
        default:
          const period = "weekly";
          const dateRange = getCurrentWeek();
          const data = (
            await knexInstance.raw(`
              WITH date_range AS (
                SELECT generate_series(
                  date_trunc('week', CURRENT_DATE)::date,
                  date_trunc('week', CURRENT_DATE)::date + interval '6 days',
                  interval '1 day'
                )::date AS day
              ),
              daily_stats AS (
                SELECT 
                  w.date,
                  SUM(w."elapsedSeconds") AS elapsedSeconds,
                  SUM(
                    CASE 
                      WHEN e."weightUnit" = 'kg' THEN e.weight * e.sets * e.reps
                      WHEN e."weightUnit" = 'lb' THEN (e.weight * 0.45359237) * e.sets * e.reps
                      ELSE 0
                    END
                  ) AS workCapacityKg
                FROM workouts w
                LEFT JOIN exercises e ON w.uid = e."workoutUid"
                WHERE w."userUid" = '40f6e5fe-5ede-46a4-976e-8ff9d1da74cd'
                  AND w.date::date >= date_trunc('week', CURRENT_DATE)::date
                  AND w.date::date < (date_trunc('week', CURRENT_DATE) + interval '1 week')::date
                GROUP BY w.date
              )
              SELECT 
                TO_CHAR(dr.day, 'YYYY-MM-DD') || ',' || TO_CHAR(dr.day, 'YYYY-MM-DD') AS "dateRange",
                COALESCE(ds.elapsedSeconds, 0) AS "elapsedSeconds",
                COALESCE(ds.workCapacityKg, 0) AS "workCapacityKg"
              FROM date_range dr
              LEFT JOIN daily_stats ds ON dr.day = ds.date::date
              ORDER BY dr.day
            `)
          ).rows;

          const response = {
            period,
            dateRange,
            data,
          };
          return response;
        case "Month":
          break;
        case "Year":
          break;
        case "Lifetime":
          break;
      }

      const weeklyResponseExample = {
        period: "weekly",
        dateRange: "2025-01-01,2025-01-31",
        data: [
          // data is broken up by the day
          {
            dateRange: "2025-01-01,2025-01-01",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-01-02,2025-01-02",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-01-03,2025-01-03",
            elapsedSeconds: 45 * 60, // 45 mins
            workCapacityKg: 5800,
          },
          {
            dateRange: "2025-01-04,2025-01-04",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-01-05,2025-01-05",
            elapsedSeconds: 20 * 60,
            workCapacityKg: 2210,
          },
          {
            dateRange: "2025-01-06,2025-01-06",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-01-07,2025-01-07",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
        ],
      };

      const montlyResponseExample = {
        period: "monthly",
        dateRange: "2024-12-30,2025-02-02",
        data: [
          // Data is broken up by the week
          {
            dateRange: "2024-12-30,2025-01-05",
            elapsedSeconds: 5172,
            workCapacityKg: 23400,
          },
          {
            dateRange: "2025-01-06,2025-01-12",
            elapsedSeconds: 4524,
            workCapacityKg: 15600,
          },
          {
            dateRange: "2025-01-13,2025-01-19",
            elapsedSeconds: 12360,
            workCapacityKg: 43400,
          },
          {
            dateRange: "2025-01-20,2025-01-26",
            elapsedSeconds: 5095,
            workCapacityKg: 23999,
          },
          {
            dateRange: "2025-01-27,2025-02-02", // Notice this week overlaps 2 months
            elapsedSeconds: 3245,
            workCapacityKg: 13450,
          },
        ],
      };

      const annualResponseExample = {
        period: "annually",
        dateRange: "2025-01-01,2025-12-31",
        data: [
          // Data is broken up by the month
          {
            dateRange: "2025-01-01,2025-01-31",
            elapsedSeconds: 51372,
            workCapacityKg: 234030,
          },
          {
            dateRange: "2025-02-01,2025-02-28",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-03-01,2025-03-31",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-04-01,2025-04-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-05-01,2025-05-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-06-01,2025-06-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-07-01,2025-07-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-08-01,2025-08-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-09-01,2025-09-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-10-01,2025-10-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-11-01,2025-11-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
          {
            dateRange: "2025-12-01,2025-12-30",
            elapsedSeconds: 0,
            workCapacityKg: 0,
          },
        ],
      };

      const lifetimeResponseExample = {
        period: "lifetime",
        dateRange: "2021-01-01,2025-12-31",
        data: [
          // Data is broken up by the year
          {
            dateRange: "2021-01-01,2021-12-31",
            elapsedSeconds: 11372,
            workCapacityKg: 89030,
          },
          {
            dateRange: "2022-01-01,2022-12-31",
            elapsedSeconds: 23324,
            workCapacityKg: 176500,
          },
          {
            dateRange: "2023-01-01,2023-12-31",
            elapsedSeconds: 27360,
            workCapacityKg: 203400,
          },
          {
            dateRange: "2024-01-01,2024-12-31",
            elapsedSeconds: 34595,
            workCapacityKg: 233999,
          },
          {
            dateRange: "2025-01-01,2025-12-31",
            elapsedSeconds: 3245,
            workCapacityKg: 13450,
          },
        ],
      };

      switch (period) {
        // case "Week":
        // default:
        //   return weeklyResponseExample;
        case "Month":
        default:
          return montlyResponseExample;
        case "Year":
          return annualResponseExample;
        case "Lifetime":
          return lifetimeResponseExample;
      }
    },
  },

  // This is the resolver for returning all exercises within a workout
  Workout: {
    async exercises(parent: Workout, __: any, { req }: any) {
      if (!req.userUid || req.userUid !== parent.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("exercises")
          .select("*")
          .where({ workoutUid: parent.uid });
      } catch (error) {
        console.error("Error fetching exercises:", error);
        throw error;
      }
    },
  },

  // Takes in the same args as our query resolvers
  Mutation: {
    async addUser(_, { user }: { user: AddOrEditUserInput }, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        let newUser = {
          ...user,
          isAuthorized: false,
        };
        await knexInstance("users").insert(newUser);

        const insertedUser = await knexInstance("users")
          .where({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          })
          .first();

        return insertedUser;
      } catch (error) {
        console.error("Error adding user:", error);
        throw error;
      }
    },

    async addWorkoutWithExercises(
      _,
      {
        userUid,
        workoutWithExercises,
      }: {
        userUid: string;
        workoutWithExercises: AddWorkoutWithExercisesInput;
      },
      { req }: any
    ) {
      if (!userUid) {
        throw new Error("userUid required to addWorkoutWithExercises");
      }
      if (!req.userUid || req.userUid !== userUid) {
        throw new NotAuthorizedError();
      }
      const newExercises = formatExercisesForDB(workoutWithExercises.exercises);
      const newWorkout = formatWorkoutForDB(workoutWithExercises, userUid);

      const isWorkoutValid = verifyWorkout(newWorkout);
      if (isWorkoutValid.result === false) {
        throw new Error(isWorkoutValid.reason);
      }
      const areExercisesValid = verifyExercises({ exercises: newExercises });
      if (areExercisesValid.result === false) {
        throw new Error(areExercisesValid.reason);
      }

      let addedWorkoutWithExercises;
      try {
        addedWorkoutWithExercises = await knexInstance.transaction(
          async function (trx) {
            try {
              const [workout] = (await trx("workouts")
                .returning("*")
                .insert(newWorkout)) as unknown as Workout[];

              const [exercises] = (await Promise.all(
                newExercises.map((exercise) => {
                  return trx("exercises")
                    .returning("*")
                    .insert({
                      ...exercise,
                      workoutUid: workout.uid,
                    });
                })
              )) as unknown as Exercise[];

              return {
                ...workout,
                exercises,
              };
            } catch (error) {
              console.log(error.message);
              await trx.rollback();
              throw new Error("Failed to create workout with exercises.");
            }
          }
        );
      } catch (error) {
        console.log(error.message);
        throw new Error("Failed to create workout with exercises.");
      }
      return addedWorkoutWithExercises;
    },

    async addWorkout(
      _,
      {
        userUid,
        workout,
      }: {
        userUid: String;
        workout: AddOrEditWorkoutInput;
      },
      { req }: any
    ) {
      if (!req.userUid || req.userUid !== userUid) {
        throw new NotAuthorizedError();
      }
      try {
        let newWorkout = {
          ...workout,
          userUid: userUid,
        };
        await knexInstance("workouts").insert(newWorkout);

        const insertedWorkout = await knexInstance("workouts")
          .where({
            comment: workout.comment,
            userUid: userUid,
          })
          .first();

        return insertedWorkout;
      } catch (error) {
        console.error("Error adding workout:", error);
        throw error;
      }
    },

    async addExercise(
      _,
      {
        workoutUid,
        exercise,
      }: { workoutUid: String; exercise: Omit<Exercise, "uid" | "workoutUid"> },
      { req }: any
    ) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        let newExercise = {
          ...exercise,
          workoutUid: workoutUid,
        };
        await knexInstance("exercises").insert(newExercise);

        const insertedExercise = await knexInstance("exercises")
          .where({
            title: exercise.title,
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps,
            workoutUid: workoutUid,
          })
          .first();

        return insertedExercise;
      } catch (error) {
        console.error("Error adding exercise:", error);
        throw error;
      }
    },

    async updateUser(
      _,
      args: {
        uid: string;
        edits: AddOrEditUserInput;
      },
      { req }: any
    ) {
      if (!req.userUid || req.userUid !== args.uid) {
        throw new NotAuthorizedError();
      }

      const { edits, uid } = args;

      try {
        await knexInstance("users").where({ uid: uid }).update(edits);
        return await knexInstance("users").where({ uid: uid }).first();
      } catch (e) {
        console.error("Error updating user:", e);
        throw e;
      }
    },

    async updateWorkout(
      _,
      { uid, edits }: { uid: String; edits: AddOrEditWorkoutInput },
      { req }: any
    ) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }

      try {
        await knexInstance("workouts").where({ uid: uid }).update(edits);
        return await knexInstance("workouts").where({ uid: uid }).first();
      } catch (error) {
        console.error("Error updating workout:", error);
        throw error;
      }
    },

    async updateExercise(
      _,
      {
        uid,
        edits,
      }: { uid: String; edits: Omit<Exercise, "uid" | "workoutUid"> },
      { req }: any
    ) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }

      // You may only edit your own exercises
      const userUidOfExercise = (
        await knexInstance("exercises as e")
          .join("workouts as w", "w.uid", "=", "e.workoutUid")
          .join("users as u", "w.userUid", "=", "u.uid")
          .select("u.uid")
          .where("e.uid", "=", uid)
          .first()
      ).uid;
      if (userUidOfExercise !== req.userUid) {
        throw new NotAuthorizedError();
      }

      // Merge old exercise with new edits, then verify the new exercise
      // for any errors before writing to the database
      let oldExercise = (
        await knexInstance("exercises").where({ uid: uid })
      )[0];
      const mergedExercise = { ...oldExercise, ...edits };
      const newExercises = formatExercisesForDB([mergedExercise]);
      const areExercisesValid = verifyExercises({
        exercises: newExercises,
        updatingWorkout: true,
      });
      if (areExercisesValid.result === false) {
        throw new Error(areExercisesValid.reason);
      }

      // Format has been verified, now update the exercise in the DB
      try {
        const updatedExercise = await knexInstance("exercises")
          .where({ uid: uid })
          .update(edits)
          .returning("*");
        return updatedExercise[0];
      } catch (error) {
        console.error("Error updating exercise:", error);
        throw error;
      }
    },

    async updateWorkoutWithExercises(
      _,
      {
        workoutUid,
        workoutWithExercises,
      }: {
        workoutUid: String;
        workoutWithExercises: UpdateWorkoutWithExercisesInput;
      },
      { req }: any
    ) {
      // 1. Validate auth token
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }

      // 2. Validate current user owns the workout with exercises
      const dbWorkout = await knexInstance("workouts")
        .where({ uid: workoutUid })
        .first();
      if (dbWorkout.userUid !== req.userUid) {
        throw NotAuthorizedError;
      }

      // 3. Format workout and exercises for DB
      const newExercises = formatExercisesForDB(workoutWithExercises.exercises);
      const newWorkout = formatWorkoutForDB(workoutWithExercises, req.userUid);

      // 4. Verify workout and exercise data for errors
      const isWorkoutValid = verifyWorkout(newWorkout);
      if (isWorkoutValid.result === false) {
        throw new Error(isWorkoutValid.reason);
      }
      const areExercisesValid = verifyExercises({
        exercises: newExercises,
        updatingWorkout: true,
      });
      if (areExercisesValid.result === false) {
        throw new Error(areExercisesValid.reason);
      }

      const dbExercises = await knexInstance("exercises").where({
        workoutUid: workoutUid,
      });

      let updatedWorkoutWithExercises;
      // Data is ready, start updating in a transaction. Rollback if any errors occur.
      try {
        updatedWorkoutWithExercises = await knexInstance.transaction(
          async function (trx) {
            try {
              // 5. Update all exercises that have changed
              for (let exercise of newExercises) {
                const dbExercise = dbExercises.find(
                  (dbExercise) => dbExercise.uid === exercise.uid
                );
                if (!dbExercise) {
                  throw new Error(
                    `Exercise with uid ${exercise.uid} not found in DB.`
                  );
                }
                const mergedExercise = { ...dbExercise, ...exercise };

                await trx("exercises")
                  .where({ uid: exercise.uid })
                  .update(mergedExercise);
              }

              // 6. Delete any exercises that have been removed
              if (newExercises.length !== dbExercises.length) {
                const exercisesToDelete = dbExercises.filter(
                  (dbExercise) =>
                    !newExercises.find(
                      (exercise) => exercise.uid === dbExercise.uid
                    )
                );
                for (let exercise of exercisesToDelete) {
                  await trx("exercises").where({ uid: exercise.uid }).del();
                }
              }

              // 7. Update the workout
              await trx("workouts")
                .where({ uid: workoutUid })
                .update(newWorkout);

              // 8. Fetch updated data to return
              const [updatedWorkout] = await trx("workouts").where({
                uid: workoutUid,
              });
              const updatedExercises = await trx("exercises").where({
                workoutUid: workoutUid,
              });

              return {
                ...updatedWorkout,
                exercises: updatedExercises,
              };
            } catch (error) {
              await trx.rollback();
              throw new Error("Failed to updateWorkoutWithExercises.");
            }
          }
        );
      } catch (error) {
        console.error("Error deleting workout with exercises:", error);
        throw error;
      }

      return updatedWorkoutWithExercises;
    },

    async deleteUser(_, { uid }: { uid: String }, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        const workoutsCount = Number(
          (
            await knexInstance("workouts")
              .count("*")
              .where({ userUid: uid })
              .first()
          ).count
        );

        if (workoutsCount > 0) {
          throw new Error(
            `Please delete the ${workoutsCount} workouts associated with this user before deleting the user. Exiting without deleting user.`
          );
        }

        const numAffectedRows = await knexInstance("users")
          .where({ uid: uid })
          .del();

        console.log(`${numAffectedRows} rows affected in deleteUser mutation.`);

        return await knexInstance("users").select("*");
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    // TODO: This is safely deleting workout & exercises, but the exercises returned is an empty array
    async deleteWorkoutWithExercises(
      _,
      { workoutUid }: { workoutUid: String },
      { req }: any
    ) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      const workout = await knexInstance("workouts").where({ uid: workoutUid });

      if (workout[0].userUid !== req.userUid) {
        throw new NotAuthorizedError();
      }

      if (!workout) {
        throw new Error("Workout not found.");
      }
      if (workout.length > 1) {
        throw new Error(
          `${workout.length} workouts found with uid ${workoutUid}. Exiting gracefully..`
        );
      }
      const exercises = await knexInstance("exercises").where({
        workoutUid: workoutUid,
      });
      if (!exercises) {
        throw new Error("Exercises not found.");
      }
      const workoutWithExercises = {
        ...workout[0],
        exercises,
      };

      try {
        await knexInstance.transaction(async function (trx) {
          try {
            await trx("exercises").where({ workoutUid: workoutUid }).del();
            await trx("workouts").where({ uid: workoutUid }).del();
            await trx.commit();
          } catch (error) {
            await trx.rollback();
            throw new Error("Failed to delete workout with exercises.");
          }
        });
        return workoutWithExercises;
      } catch (error) {
        console.error("Error deleting workout with exercises:", error);
        throw error;
      }
    },

    async deleteExercise(_, { uid }: { uid: String }, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      const [exercisePlus] = await knexInstance("exercises as e")
        .join("workouts as w", "w.uid", "e.workoutUid")
        .join("users as u", "w.userUid", "u.uid")
        .select("e.*", "u.uid as userUid")
        .where("e.uid", "=", uid);

      if (!!exercisePlus === false) {
        throw new Error("Exercise not found.");
      }
      const { userUid, ...exercise } = exercisePlus;

      if (userUid !== req.userUid) {
        throw new NotAuthorizedError();
      }

      try {
        await knexInstance("exercises").where({ uid: uid }).del();
        return exercise;
      } catch (error) {
        console.error("Error deleting exercise:", error.message);
        throw error;
      }
    },

    async signUp(_, { user }: { user: AddOrEditUserInput }) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        isAuthorized: false,
      };
      try {
        const emailTaken = await knexInstance("users")
          .where({ email: user.email })
          .first();
        if (emailTaken) {
          throw new Error("Email is already in use.");
        }

        const [insertedUser] = await knexInstance("users")
          .insert(newUser)
          .returning("*");

        console.log("insertedUser: ", insertedUser);
        return insertedUser;
      } catch (error) {}
    },

    async login(
      _,
      { email, password }: { email: string; password: string },
      { res }
    ) {
      const user = await knexInstance("users").where({ email: email }).first();

      if (!user) {
        throw new Error("Invalid email address, please try again.");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new Error("Invalid credentials, please try again.");
      }

      const { refreshToken, accessToken } = createTokens(user);

      // Set refresh token in HTTP-only cookie
      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      return user;
    },

    async refreshToken(_, __, { req, res }) {
      return await refreshTokens(req, res);
    },

    async invalidateToken(_, __, { req, res }) {
      // No user, cannot invalidate their refresh token
      if (!req.userUid) {
        throw new Error("No user found to invalidate token.");
      }

      try {
        await knexInstance("users")
          .where({ uid: req.userUid })
          .increment("tokenCount", 1);

        // If you don't clear cookies, access-token will be valid until it times out
        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

        console.log(`Token count updated for user.`);
        return true;
      } catch (error) {
        console.error(`Error updating token count for user:`, error);
        throw error;
      }
    },
  },
};

export default resolvers;
