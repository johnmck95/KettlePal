import knexConfig from "../knexfile.js";
import knex from "knex";
import dayjs from "dayjs";
// import {
//   UpdateUserArgs,
//   AddOrEditUserInput,
//   User,
//   Workout,
//   AddOrEditWorkoutInput,
//   AddOrEditExerciseInput,
// } from "../../types";
/** WEIRDNESS!!  Updating this file isn't actually getting reflected in the server on it's own
 * I have to comment out the 'UpdateUserArgs' import, run the server, get the error, uncomment the import, and then run the server again.
 * ..then it magically works!! WHY. Everything else is a mess right now. Add TS types and fix the other resolvers.
 */
// Incoming Resolver Properties are: (parent, args, context)
const knexInstance = knex(knexConfig);
const resolvers = {
    // The top-level resolvers inside Query are the entry point resolvers for the graph, not nested queries like workout{ exercises{...} }
    Query: {
        async users() {
            try {
                return await knexInstance("users").select("*");
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw error;
            }
        },
        async user(_, { uid }) {
            try {
                return await knexInstance("users")
                    .select("*")
                    .where({ uid: uid })
                    .first();
            }
            catch (error) {
                console.error("Error fetching user:", error);
                throw error;
            }
        },
        async workouts() {
            try {
                return await knexInstance("workouts").select("*");
            }
            catch (error) {
                console.error("Error fetching workouts:", error);
                throw error;
            }
        },
        async workout(_, { uid }) {
            try {
                return await knexInstance("workouts")
                    .select("*")
                    .where({ uid: uid })
                    .first();
            }
            catch (error) {
                console.error("Error fetching workout:", error);
                throw error;
            }
        },
        async exercises() {
            try {
                return await knexInstance("exercises").select("*");
            }
            catch (error) {
                console.error("Error fetching exercises:", error);
                throw error;
            }
        },
        async exercise(_, { uid }) {
            try {
                return await knexInstance("exercises")
                    .select("*")
                    .where({ uid: uid })
                    .first();
            }
            catch (error) {
                console.error("Error fetching exercises:", error);
                throw error;
            }
        },
    },
    // Resolvers to gather nested fields within a User query (EX: User{ workouts{...} })
    User: {
        async workouts(parent) {
            try {
                return await knexInstance("workouts")
                    .select("*")
                    .where({ user_uid: parent.uid });
            }
            catch (error) {
                console.error("Error fetching workouts:", error);
                throw error;
            }
        },
    },
    // This is the resolver for returning all exercises within a workout
    Workout: {
        async exercises(parent) {
            try {
                return await knexInstance("exercises")
                    .select("*")
                    .where({ workout_uid: parent.uid });
            }
            catch (error) {
                console.error("Error fetching exercises:", error);
                throw error;
            }
        },
    },
    // Takes in the same args as our query resolvers
    Mutation: {
        async addUser(_, { user }) {
            try {
                let new_user = {
                    ...user,
                    is_authorized: false,
                };
                await knexInstance("users").insert(new_user);
                const insertedUser = await knexInstance("users")
                    .where({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                })
                    .first();
                return insertedUser;
            }
            catch (error) {
                console.error("Error adding user:", error);
                throw error;
            }
        },
        async addWorkout(_, { user_uid, workout, }) {
            try {
                // TODO: Implement a way of adding start and end times based on user input
                let new_workout = {
                    ...workout,
                    user_uid: user_uid,
                    start_time: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    end_time: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                };
                await knexInstance("workouts").insert(new_workout);
                const insertedWorkout = await knexInstance("workouts")
                    .where({
                    comment: workout.comment,
                    user_uid: user_uid,
                })
                    .first();
                return insertedWorkout;
            }
            catch (error) {
                console.error("Error adding workout:", error);
                throw error;
            }
        },
        async addExercise(_, { workout_uid, exercise, }) {
            try {
                // TODO: Implement a way of adding start and end times based on user input
                let new_exercise = {
                    ...exercise,
                    workout_uid: workout_uid,
                    start_time: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    end_time: dayjs()
                        .add(10, "minutes")
                        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                };
                await knexInstance("exercises").insert(new_exercise);
                const insertedExercise = await knexInstance("exercises")
                    .where({
                    title: exercise.title,
                    weight: exercise.weight,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    workout_uid: workout_uid,
                })
                    .first();
                return insertedExercise;
            }
            catch (error) {
                console.error("Error adding exercise:", error);
                throw error;
            }
        },
        async updateUser(_, args) {
            const { edits, uid } = args;
            try {
                await knexInstance("users").where({ uid: uid }).update(edits);
                return await knexInstance("users").where({ uid: uid }).first();
            }
            catch (e) {
                console.error("Error updating user:", e);
                throw e;
            }
        },
        async updateWorkout(_, { uid, edits }) {
            try {
                await knexInstance("workouts").where({ uid: uid }).update(edits);
                return await knexInstance("workouts").where({ uid: uid }).first();
            }
            catch (error) {
                console.error("Error updating workout:", error);
                throw error;
            }
        },
        async updateExercise(_, { uid, edits }) {
            try {
                await knexInstance("exercises").where({ uid: uid }).update(edits);
                return await knexInstance("exercises").where({ uid: uid }).first();
            }
            catch (error) {
                console.error("Error updating exercise:", error);
                throw error;
            }
        },
        async deleteUser(_, { uid }) {
            try {
                const workoutsCount = Number((await knexInstance("workouts")
                    .count("*")
                    .where({ user_uid: uid })
                    .first()).count);
                if (workoutsCount > 0) {
                    throw new Error(`Please delete the ${workoutsCount} workouts associated with this user before deleting the user. Exiting without deleting user.`);
                }
                const numAffectedRows = await knexInstance("users")
                    .where({ uid: uid })
                    .del();
                console.log(`${numAffectedRows} rows affected in deleteUser mutation.`);
                return await knexInstance("users").select("*");
            }
            catch (error) {
                console.error("Error deleting user:", error);
                throw error;
            }
        },
        async deleteWorkout(_, { uid }) {
            try {
                const exercisesCount = Number((await knexInstance("exercises")
                    .count("*")
                    .where({ workout_uid: uid })
                    .first()).count);
                if (exercisesCount > 0) {
                    throw new Error(`Please delete the ${exercisesCount} exercises associated with this workout before deleting the workout. Exiting without deleting workout.`);
                }
                const numAffectedRows = await knexInstance("workouts")
                    .where({ uid: uid })
                    .del();
                console.log(`${numAffectedRows} rows affected in deleteWorkout mutation.`);
                return await knexInstance("workouts").select("*");
            }
            catch (error) {
                console.error("Error deleting workout:", error);
                throw error;
            }
        },
        async deleteExercise(_, { uid }) {
            try {
                const numAffectedRows = await knexInstance("exercises")
                    .where({ uid: uid })
                    .del();
                console.log(`${numAffectedRows} rows affected in deleteExercise mutation.`);
                return await knexInstance("exercises").select("*");
            }
            catch (error) {
                console.error("Error deleting exercise:", error);
                throw error;
            }
        },
    },
};
export default resolvers;
