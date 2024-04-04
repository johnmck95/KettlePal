/** GQL Primitive Types: id, int, float, string, boolean */

const typeDefs = `#graphql
    type User {
        uid: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
        is_authorized: Boolean!
    }

    type Workout {
        uid: ID!
        start_time: Int!
        end_time: Int!
        comment: String
        user_uid: ID!
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
`;

export default typeDefs;
