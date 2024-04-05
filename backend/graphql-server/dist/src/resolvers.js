import mock_db from "./mock_db.js";
import { v4 as uuidv4 } from "uuid";
import knex from "./knexfile.js";
// import knex from "knex";
// const useKnex = knex(knexConfig);
// Incoming Resolver Properties are: (parent, args, context)
const resolvers = {
    // The top-level resolvers inside Query are the entry point resolvers for the graph
    // They don't handlke nested queries, like workout{ exercises{...} }
    Query: {
        async users() {
            try {
                return await knex("users").select("*");
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw error;
            }
        },
        async user(_, args) {
            try {
                return await knex("users").select("*").where({ uid: args.uid }).first();
            }
            catch (error) {
                console.error("Error fetching user:", error);
                throw error;
            }
        },
        workouts() {
            return mock_db.workouts;
        },
        workout(_, args) {
            return mock_db.workouts.find((workout) => workout.uid === args.uid);
        },
        exercises() {
            return mock_db.exercises;
        },
        exercise(_, args) {
            return mock_db.exercises.find((exercise) => exercise.uid === args.uid);
        },
    },
    // This is the resolver to gather all of the workouts for a given user
    User: {
        workouts(parent) {
            return mock_db.workouts.filter((workout) => workout.user_uid === parent.uid);
        },
    },
    // This is the resolver for returning all exercises within a workout
    Workout: {
        exercises(parent) {
            return mock_db.exercises.filter((exercise) => exercise.workout_uid === parent.uid);
        },
    },
    // Takes in the same args as our query resolvers
    Mutation: {
        deleteExercise(_, args) {
            mock_db.exercises = mock_db.exercises.filter((exercise) => exercise.uid !== args.uid);
            return mock_db.exercises;
        },
        // TODO: deleteWorkoutWithExercises
        // TODO: deleteUserWithWorkouts
        addUser(_, args) {
            let new_user = {
                ...args.user,
                uid: uuidv4(),
                is_authorized: false,
            };
            mock_db.users.push(new_user);
            return new_user;
        },
        updateUser(_, args) {
            mock_db.users = mock_db.users.map((user) => {
                if (user.uid === args.uid) {
                    return { ...user, ...args.edits };
                }
                return user;
            });
            return mock_db.users.find((user) => user.uid === args.uid);
        },
    },
};
export default resolvers;
