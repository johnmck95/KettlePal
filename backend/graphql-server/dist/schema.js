/** GQL Primitive Types: id, int, float, string, boolean */
const typeDefs = `#graphql
    type User {
        uid: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
        is_authorized: Boolean!
        workouts: [Workout!]
        created_at: Int! 
    }

    type Workout {
        uid: ID!
        start_time: Int!
        end_time: Int!
        comment: String
        user_uid: ID!
        exercises: [Exercise!]
    }

    type Exercise {
        uid: ID!
        workout_uid: ID!
        title: String!
        weight: Float
        weight_unit: String
        sets: Int
        reps: Int
        reps_display: String
        comment: String
        start_time: Int
        end_time: Int
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
        deleteExercise(uid: ID!): [Exercise]!
        # TODO: deleteWorkoutWithExercises
        # TODO: deleteUserWithWorkouts

        addUser(user: AddUserInput!): User 
        addExercise(workout_uid: ID!, exercise: AddExerciseInput!): Exercise
        addWorkout(user_uid: ID!, workout: AddWorkoutInput!): Workout
        # TODO: add workoutWithExercises

        updateUser(uid: ID!, edits: EditUserInput!): User
        # TODO: add updateWorkout
        # TODO: add updateExercise
    }   
    
    # "This isn't a type, it's a collection of fields for a mutation"
    # Note: No uid or is_authorized, we want our system to handle those
    input AddUserInput {
        first_name: String!
        last_name: String!
        email: String!
        password: String!
    }

    input AddWorkoutInput {
        start_time: Int
        end_time: Int
        comment: String
    }

    input AddExerciseInput {
        title: String!
        weight: Float
        weight_unit: String
        sets: Int
        reps: Int
        reps_display: String
        comment: String
        start_time: Int
        end_time: Int
    
    }

    input EditUserInput {
        first_name: String
        last_name: String
        email: String
        password: String
    }

`;
export default typeDefs;
