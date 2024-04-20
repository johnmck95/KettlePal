import knexConfig from "../knexfile.js";
import knex from "knex";

const knexInstance = knex(knexConfig);
// Incoming Resolver Properties are: (parent, args, context)
const resolvers = {
  // The top-level resolvers inside Query are the entry point resolvers for the graph
  // They don't handlke nested queries, like workout{ exercises{...} }
  Query: {
    async users() {
      try {
        return await knexInstance("users").select("*");
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    async user(_, args) {
      try {
        return await knexInstance("users")
          .select("*")
          .where({ uid: args.uid })
          .first();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },

    async workouts() {
      try {
        return await knexInstance("workouts").select("*");
      } catch (error) {
        console.error("Error fetching workouts:", error);
        throw error;
      }
    },
    async workout(_, args) {
      try {
        return await knexInstance("workouts")
          .select("*")
          .where({ uid: args.uid })
          .first();
      } catch (error) {
        console.error("Error fetching workout:", error);
        throw error;
      }
    },

    async exercises() {
      try {
        return await knexInstance("exercises").select("*");
      } catch (error) {
        console.error("Error fetching exercises:", error);
        throw error;
      }

      // return mock_db.exercises;
    },
    async exercise(_, args) {
      try {
        return await knexInstance("exercises")
          .select("*")
          .where({ uid: args.uid })
          .first();
      } catch (error) {
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
      } catch (error) {
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
      } catch (error) {
        console.error("Error fetching exercises:", error);
        throw error;
      }
    },
  },

  // Takes in the same args as our query resolvers
  Mutation: {
    async deleteExercise(_, args) {
      try {
        const numAffectedRows = await knexInstance("exercises")
          .where({ uid: args.uid })
          .del();

        console.log(
          `${numAffectedRows} rows affected in deleteExercise mutation.`
        );

        return await knexInstance("exercises").select("*");
      } catch (error) {
        console.error("Error deleting exercise:", error);
        throw error;
      }
    },
    // TODO: deleteWorkoutWithExercises
    // TODO: deleteUserWithWorkouts

    async addUser(_, args) {
      try {
        let new_user = {
          ...args.user,
          is_authorized: false,
        };
        await knexInstance("users").insert(new_user);

        const insertedUser = await knexInstance("users")
          .where({
            email: args.user.email,
            first_name: args.user.first_name,
            last_name: args.user.last_name,
          })
          .first();

        return insertedUser;
      } catch (error) {
        console.error("Error adding user:", error);
        throw error;
      }
    },

    async updateUser(_, args) {
      try {
        await knexInstance("users").where({ uid: args.uid }).update(args.edits);

        return await knexInstance("users").where({ uid: args.uid }).first();
      } catch (e) {
        console.error("Error updating user:", e);
        throw e;
      }
    },
  },
};

export default resolvers;
