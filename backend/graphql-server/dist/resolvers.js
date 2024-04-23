import knexConfig from "../knexfile.js";
import knex from "knex";
// import { UpdateUserArgs, AddOrEditUserInput, User, Workout } from "../../types";
const knexInstance = knex(knexConfig);
// Incoming Resolver Properties are: (parent, args, context)
const resolvers = {
    // The top-level resolvers inside Query are the entry point resolvers for the graph
    // They don't handle nested queries, like workout{ exercises{...} }
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
            // return mock_db.exercises;
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
    // This is the resolver to gather all of the workouts for a given user
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
        // async deleteUserWithWorkouts (cascased to exercises)
        // async deleteWorkoutWithExercises
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
        /** WEIRDNESS!!  Updating this function isn't actually getting reflected in the server on it's own
         * I have to comment out the 'UpdateUserArgs' import, run the server, get the error, uncomment the import, and then run the server again.
         * ..then it magically works!! WHY. Everything else is a mess right now. Add TS types and fix the other resolvers.
         */
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
        // addWorkoutWithExercises
        // updateWorkoutWithExercises
    },
};
export default resolvers;
