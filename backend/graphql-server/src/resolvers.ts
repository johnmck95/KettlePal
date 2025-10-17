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
  AtAGlanceData,
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
                      WHEN "weightUnit" = 'lb' THEN weight * 0.45359237
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
    // dateRange: Must be of the form: "YYYY-MM-DD,YYYY-MM-DD"
    async atAGlance(
      parent: User,
      {
        period,
        dateRange,
      }: { period: "Week" | "Month" | "Year" | "Lifetime"; dateRange: string }
    ) {
      function getRangeFromData(queriedData: AtAGlanceData[]) {
        const start = queriedData[0].dateRange.split(",")[0];
        const end = queriedData[queriedData.length - 1].dateRange.split(",")[1];
        const range = `${start},${end}`;
        return range;
      }

      switch (period) {
        case "Week":
        default:
          const weeklyPeriod = "weekly";
          const weeklyData: AtAGlanceData[] = (
            await knexInstance.raw(`
              WITH date_range AS (
                SELECT generate_series(
                  DATE(SPLIT_PART('${dateRange}', ',', 1))::date,
                  DATE(SPLIT_PART('${dateRange}', ',', 2))::date,
                  interval '1 day'
                )::date AS day
              ),
              daily_elapsed_seconds AS (
                SELECT
                  w.date::date,
                  SUM(w."elapsedSeconds") AS elapsedSeconds
                FROM workouts w
                WHERE w."userUid" = '${parent.uid}'
                  AND w.date::date >= DATE(SPLIT_PART('${dateRange}', ',', 1))::date
                  AND w.date::date <= DATE(SPLIT_PART('${dateRange}', ',', 2))::date
                GROUP BY w.date::date
              ),
              daily_work_capacity AS (
                SELECT
                  w.date::date,
                  SUM(
                    CASE
                      WHEN e."weightUnit" = 'kg' THEN (e.weight * e.sets * e.reps)::INTEGER
                      WHEN e."weightUnit" = 'lb' THEN ((e.weight * 0.45359237) * e.sets * e.reps)::INTEGER
                      ELSE 0
                    END
                  ) AS workCapacityKg
                FROM workouts w
                LEFT JOIN exercises e ON w.uid = e."workoutUid"
                WHERE w."userUid" = '${parent.uid}'
                  AND w.date::date >= DATE(SPLIT_PART('${dateRange}', ',', 1))::date
                  AND w.date::date <= DATE(SPLIT_PART('${dateRange}', ',', 2))::date
                GROUP BY w.date::date
              )
              SELECT
                TO_CHAR(dr.day, 'YYYY-MM-DD') || ',' || TO_CHAR(dr.day, 'YYYY-MM-DD') AS "dateRange",
                COALESCE(des.elapsedSeconds, 0) AS "elapsedSeconds",
                COALESCE(dwc.workCapacityKg, 0) AS "workCapacityKg"
              FROM date_range dr
              LEFT JOIN daily_elapsed_seconds des ON dr.day = des.date
              LEFT JOIN daily_work_capacity dwc ON dr.day = dwc.date
              ORDER BY dr.day;
            `)
          ).rows;
          const weeklyDateRange = getRangeFromData(weeklyData);

          return {
            period: weeklyPeriod,
            dateRange: weeklyDateRange,
            data: weeklyData,
          };

        case "Month":
          const montlyPeriod = "monthly";
          const monthlyData: AtAGlanceData[] = (
            await knexInstance.raw(`
              WITH current_month AS (
                SELECT 
                  date_trunc('month', CURRENT_DATE) AS first_day_of_month,
                  (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day') AS last_day_of_month
              ),
              weeks_in_month AS (
                SELECT 
                  generate_series(
                    date_trunc('week', (SELECT first_day_of_month FROM current_month))::date,
                    date_trunc('week', (SELECT last_day_of_month FROM current_month))::date,
                    interval '7 days'
                  )::date AS week_start
              ),
              weekly_stats AS (
                SELECT 
                  weeks.week_start,
                  weeks.week_start + interval '6 days' AS week_end,
                  -- Use DISTINCT to avoid duplicate elapsedSeconds when joining with exercises
                  COALESCE((
                    SELECT SUM(w."elapsedSeconds")
                    FROM workouts w
                    WHERE w.date::date >= weeks.week_start 
                      AND w.date::date <= weeks.week_start + interval '6 days'
                      AND w."userUid" = '${parent.uid}'
                  ), 0) AS elapsedSeconds,
                  COALESCE(SUM(
                    CASE 
                      WHEN e."weightUnit" = 'kg' THEN (e.weight * e.sets * e.reps)::INTEGER
                      WHEN e."weightUnit" = 'lb' THEN ((e.weight * 0.45359237) * e.sets * e.reps)::INTEGER
                      ELSE 0
                    END
                  ), 0) AS workCapacityKg
                FROM weeks_in_month weeks
                LEFT JOIN workouts w ON w.date::date >= weeks.week_start AND w.date::date <= weeks.week_start + interval '6 days'
                  AND w."userUid" = '${parent.uid}'
                LEFT JOIN exercises e ON w.uid = e."workoutUid"
                GROUP BY weeks.week_start
              )
              SELECT 
                TO_CHAR(week_start, 'YYYY-MM-DD') || ',' || TO_CHAR(week_end, 'YYYY-MM-DD') AS "dateRange",
                elapsedSeconds AS "elapsedSeconds",
                workCapacityKg as "workCapacityKg"
              FROM weekly_stats
              ORDER BY week_start;
            `)
          ).rows;
          const monthlyDateRange = getRangeFromData(monthlyData);

          return {
            period: montlyPeriod,
            dateRange: monthlyDateRange,
            data: monthlyData,
          };
        case "Year":
          const annualPeriod = "annually";
          const yearlyData: AtAGlanceData[] = (
            await knexInstance.raw(`
              WITH current_year AS (
                SELECT 
                  date_trunc('year', CURRENT_DATE) AS first_day_of_year,
                  (date_trunc('year', CURRENT_DATE) + interval '1 year - 1 day') AS last_day_of_year
              ),
              months_in_year AS (
                SELECT 
                  generate_series(
                    date_trunc('month', (SELECT first_day_of_year FROM current_year))::date,
                    date_trunc('month', (SELECT last_day_of_year FROM current_year))::date,
                    interval '1 month'
                  )::date AS month_start
              ),
              monthly_stats AS (
                SELECT 
                  months.month_start,
                  (months.month_start + interval '1 month - 1 day')::date AS month_end,
                  COALESCE((
                    SELECT SUM(w."elapsedSeconds")
                    FROM workouts w
                    WHERE w.date::date >= months.month_start 
                      AND w.date::date <= (months.month_start + interval '1 month - 1 day')::date
                      AND w."userUid" = '${parent.uid}'
                  ), 0)::INTEGER AS elapsedSeconds,
                  COALESCE(SUM(
                    CASE 
                      WHEN e."weightUnit" = 'kg' THEN (e.weight * e.sets * e.reps)::INTEGER
                      WHEN e."weightUnit" = 'lb' THEN ((e.weight * 0.45359237) * e.sets * e.reps)::INTEGER
                      ELSE 0
                    END
                  ), 0) AS workCapacityKg
                FROM months_in_year months
                LEFT JOIN workouts w ON w.date::date >= months.month_start AND w.date::date <= (months.month_start + interval '1 month - 1 day')::date
                  AND w."userUid" = '${parent.uid}'
                LEFT JOIN exercises e ON w.uid = e."workoutUid"
                GROUP BY months.month_start
              )
              SELECT 
                TO_CHAR(month_start, 'YYYY-MM-DD') || ',' || TO_CHAR(month_end, 'YYYY-MM-DD') AS "dateRange",
                elapsedSeconds AS "elapsedSeconds",
                workCapacityKg AS "workCapacityKg"
              FROM monthly_stats
              ORDER BY month_start;
          `)
          ).rows;
          const yearlyDateRange = getRangeFromData(yearlyData);

          return {
            period: annualPeriod,
            dateRange: yearlyDateRange,
            data: yearlyData,
          };

        case "Lifetime":
          const lifetimePeriod = "lifetime";
          const lifetimeData: AtAGlanceData[] = (
            await knexInstance.raw(`
              WITH year_range AS (
                SELECT generate_series(
                  date_trunc('year', (SELECT MIN(date::date) FROM workouts WHERE "userUid" = '${parent.uid}'))::date,
                  date_trunc('year', CURRENT_DATE)::date,
                  interval '1 year'
                ) AS year_start
              ),
              yearly_elapsed_seconds AS (
                SELECT 
                  date_trunc('year', w.date::date)::date AS year_start,
                  SUM(w."elapsedSeconds")::INTEGER AS elapsedSeconds
                FROM workouts w
                WHERE w."userUid" = '${parent.uid}'
                GROUP BY date_trunc('year', w.date::date)
              ),
              yearly_work_capacity AS (
                SELECT 
                  date_trunc('year', w.date::date)::date AS year_start,
                  SUM(
                    CASE 
                      WHEN e."weightUnit" = 'kg' THEN (e.weight * e.sets * e.reps)::INTEGER
                      WHEN e."weightUnit" = 'lb' THEN ((e.weight * 0.45359237) * e.sets * e.reps)::INTEGER
                      ELSE 0
                    END
                  )::INTEGER AS workCapacityKg
                FROM workouts w
                LEFT JOIN exercises e ON w.uid = e."workoutUid"
                WHERE w."userUid" = '${parent.uid}'
                GROUP BY date_trunc('year', w.date::date)
              ),
              yearly_stats AS (
                SELECT 
                  yr.year_start,
                  (yr.year_start + interval '1 year - 1 day')::date AS year_end,
                  COALESCE(ys.elapsedSeconds, 0) AS elapsedSeconds,
                  COALESCE(yw.workCapacityKg, 0) AS workCapacityKg
                FROM year_range yr
                LEFT JOIN yearly_elapsed_seconds ys ON yr.year_start = ys.year_start
                LEFT JOIN yearly_work_capacity yw ON yr.year_start = yw.year_start
              )
              SELECT 
                TO_CHAR(year_start, 'YYYY-MM-DD') || ',' || TO_CHAR(year_end, 'YYYY-MM-DD') AS "dateRange",
                elapsedSeconds AS "elapsedSeconds",
                workCapacityKg AS "workCapacityKg"
              FROM yearly_stats
              ORDER BY year_start;
          `)
          ).rows;
          const lifetimeDateRange = getRangeFromData(lifetimeData);

          return {
            period: lifetimePeriod,
            dateRange: lifetimeDateRange,
            data: lifetimeData,
          };
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

    async signUp(_, { user }: { user: AddOrEditUserInput }, { res }) {
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

        const { refreshToken, accessToken } = createTokens(insertedUser);

        // Set refresh token in HTTP-only cookie
        setAccessToken(res, accessToken);
        setRefreshToken(res, refreshToken);

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
