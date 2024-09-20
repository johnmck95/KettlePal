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
  User,
  Workout,
} from "./generated/backend-types.js";

// Incoming Resolver Properties are: (parent, args, context)
const knexInstance = knex(knexConfig);

const resolvers = {
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
    async user(_, { uid }: { uid: String }, { req }: any) {
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

    async workouts(_, __, { req }: any) {
      if (!req.userUid) {
        throw new NotAuthorizedError();
      }
      try {
        return await knexInstance("workouts")
          .select("*")
          .orderBy("createdAt", "desc");
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
    async workouts(parent: User) {
      try {
        return await knexInstance("workouts")
          .select("*")
          .where({ userUid: parent.uid })
          .orderBy("createdAt", "desc");
      } catch (error) {
        console.error("Error fetching workouts:", error);
        throw error;
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
      const areExercisesValid = verifyExercises(newExercises);
      if (areExercisesValid.result === false) {
        throw new Error(areExercisesValid.reason);
      }

      try {
        let addedWorkoutWithExercises = null;
        await knexInstance.transaction(async function (trx) {
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

            await trx.commit();

            if (trx.isCompleted()) {
              addedWorkoutWithExercises = {
                ...workout,
                exercises,
              };
            }

            return addedWorkoutWithExercises;
          } catch (error) {
            await trx.rollback();
            throw new Error("Failed to create workout with exercises.");
          }
        });

        return addedWorkoutWithExercises;
      } catch (error) {
        throw new Error("Failed to create workout with exercises.");
      }
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
      const areExercisesValid = verifyExercises(newExercises);
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
