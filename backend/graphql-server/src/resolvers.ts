import mock_db from "./mock_db.js";

// Incoming Resolver Properties are: (parent, args, context)
const resolvers = {
  Query: {
    users() {
      return mock_db.users;
    },
    user(_, args) {
      return mock_db.users.find((user) => user.uid === args.uid);
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
};

export default resolvers;
