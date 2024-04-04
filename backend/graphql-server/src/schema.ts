/** GQL Primitive Types: id, int, float, string, boolean */

const typeDefs = `#graphql
    type User {
        uid: ID!
        firstName: String!
        lastName: String!
        email: String!
    }

    type Workout {
        uid: ID!
        date: String!
        userUid: ID!
    }

    type Exercise {
        uid: ID!
        workoutUid: ID!
        title: String!
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
