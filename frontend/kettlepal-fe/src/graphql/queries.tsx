import { gql } from "@apollo/client";

/** The GQL codemon type generator is configured to create custom hooks for each
 query and mutatation is sees. Create the Query here, then call useYourQueryName 
 in the desired .tsx file. */

const USER_WITH_WORKOUTS_QUERY = gql`
  query UserWithWorkouts($uid: ID!) {
    user(uid: $uid) {
      firstName
      lastName
      workouts {
        uid
        comment
        elapsedSeconds
        createdAt
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
