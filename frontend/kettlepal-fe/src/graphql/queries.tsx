import { gql } from "@apollo/client";

/** The GQL codemon type generator is configured to create custom hooks for each
 query and mutatation is sees. Create the Query here, then call useYourQueryName 
 in the desired .tsx file. */

const USER_WITH_WORKOUTS_QUERY = gql`
  query UserWithWorkouts($uid: ID!, $offset: Int, $limit: Int) {
    user(uid: $uid) {
      firstName
      lastName
      workouts(offset: $offset, limit: $limit) {
        uid
        comment
        elapsedSeconds
        date
        exercises {
          uid
          title
          weight
          weightUnit
          sets
          reps
          repsDisplay
          comment
          elapsedSeconds
          createdAt
        }
      }
    }
  }
`;

const CHECK_SESSION_QUERY = gql`
  query CheckSession {
    checkSession {
      isValid
      user {
        uid
        firstName
        lastName
        email
        isAuthorized
        createdAt
        tokenCount
      }
    }
  }
`;
