import knexConfig from "../knexfile.js";
import knex from "knex";
import dayjs from "dayjs";
import { verifyExercises } from "./utils/verifyExercises.js";
import { verifyWorkout } from "./utils/verifyWorkout.js";
import { formatExercisesForDB, formatWorkoutForDB, } from "./utils/formatDataForDB.js";
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
                return await knexInstance("workouts")
                    .select("*")
                    .orderBy("createdAt", "desc");
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
                    .where({ userUid: parent.uid })
                    .orderBy("createdAt", "desc");
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
                    .where({ workoutUid: parent.uid });
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
            }
            catch (error) {
                console.error("Error adding user:", error);
                throw error;
            }
        },
        async addWorkoutWithExercises(_, { userUid, workoutWithExercises, }) {
            if (!userUid) {
                throw new Error("userUid required to addWorkoutWithExercises");
            }
            const newExercises = formatExercisesForDB(workoutWithExercises);
            const newWorkout = formatWorkoutForDB(workoutWithExercises, userUid);
            if (!newWorkout) {
                throw new Error("Workout required to addWorkoutWithExercises");
            }
            if (!newExercises || newExercises.length === 0) {
                throw new Error("At least one exercise required to addWorkoutWithExercises");
            }
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
                            .insert(newWorkout));
                        const [exercises] = (await Promise.all(newExercises.map((exercise) => {
                            return trx("exercises")
                                .returning("*")
                                .insert({
                                ...exercise,
                                workoutUid: workout.uid,
                            });
                        })));
                        await trx.commit();
                        if (trx.isCompleted()) {
                            addedWorkoutWithExercises = {
                                ...workout,
                                exercises,
                            };
                        }
                        return addedWorkoutWithExercises;
                    }
                    catch (error) {
                        await trx.rollback();
                        throw new Error("Failed to create workout with exercises.");
                    }
                });
                return addedWorkoutWithExercises;
            }
            catch (error) {
                throw new Error("Failed to create workout with exercises.");
            }
        },
        async addWorkout(_, { userUid, workout, }) {
            try {
                // TODO: Implement a way of adding start and end times based on user input
                let newWorkout = {
                    ...workout,
                    userUid: userUid,
                    startTime: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    endTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                };
                await knexInstance("workouts").insert(newWorkout);
                const insertedWorkout = await knexInstance("workouts")
                    .where({
                    comment: workout.comment,
                    userUid: userUid,
                })
                    .first();
                return insertedWorkout;
            }
            catch (error) {
                console.error("Error adding workout:", error);
                throw error;
            }
        },
        async addExercise(_, { workoutUid, exercise, }) {
            try {
                // TODO: Implement a way of adding start and end times based on user input
                let newExercise = {
                    ...exercise,
                    workoutUid: workoutUid,
                    startTime: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    endTime: dayjs()
                        .add(10, "minutes")
                        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
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
                    .where({ userUid: uid })
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
                    .where({ workoutUid: uid })
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
