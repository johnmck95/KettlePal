/** GQL Primitive Types: id, int, float, string, boolean */
const typeDefs = `#graphql
    type User {
        uid: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        isAuthorized: Boolean!
        workouts: [Workout!]
        createdAt: String!
    }

    type Workout {
        uid: ID!
        createdAt: String!
        elapsedSeconds: Int
        comment: String
        userUid: ID!
        exercises: [Exercise!]
    }

    type Exercise {
        uid: ID!
        workoutUid: ID!
        title: String!
        createdAt: String!
        weight: Float
        weightUnit: String
        sets: Int
        reps: Int
        repsDisplay: String
        comment: String
        elapsedSeconds: Int
    }

    # Required: Defines the entry points to the graph
    type Query {
        users: [User]
        user(uid: ID!): User
        workouts: [Workout]
        workout(uid: ID!): Workout
        exercises: [Exercise]
        exercise(uid: ID!): Exercise
    }

    type Mutation {
        deleteUser(uid: ID!): [User]!
        deleteWorkout(uid: ID!): [Workout]!
        deleteExercise(uid: ID!): [Exercise]!
        deleteWorkoutWithExercises(workoutUid: ID!): Workout!

        addUser(user: AddUserInput!): User
        addExercise(workoutUid: ID!, exercise: AddExerciseInput!): Exercise
        addWorkout(userUid: ID!, workout: AddOrEditWorkoutInput!): Workout
        addWorkoutWithExercises(userUid: ID!, workoutWithExercises: AddWorkoutWithExercisesInput!): Workout!

        updateUser(uid: ID!, edits: EditUserInput!): User
        updateWorkout(uid: ID!, edits: AddOrEditWorkoutInput!): Workout
        updateExercise(uid: ID!, edits: EditExerciseInput!): Exercise

    }

    # Input types omit data fields we want the system to generate (like uids)
    # Edits often vary from inputs, because we don't want to require all fields
    input AddUserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input EditUserInput {
        firstName: String
        lastName: String
        email: String
        password: String
    }

    input AddOrEditWorkoutInput {
        createdAt: String
        elapsedSeconds: Int
        comment: String
    }

    input AddWorkoutWithExercisesInput {
        createdAt: String
        elapsedSeconds: Int
        comment: String
        exercises: [AddExerciseInput]!
    }

    input AddExerciseInput {
        title: String!
        weight: String
        weightUnit: String
        sets: String
        reps: String
        repsDisplay: String
        comment: String
        elapsedSeconds: Int
        key: String
    }

    input EditExerciseInput {
        title: String!
        weight: String
        weightUnit: String
        sets: String
        reps: String
        repsDisplay: String
        comment: String
        elapsedSeconds: Int
    }

`;
export default typeDefs;
