import { gql } from "@apollo/client";

/** The GQL codemon type generator is configured to create custom hooks for each
 query and mutatation is sees. Create the Query here, then call useYourQueryName 
 in the desired .tsx file. */

const PAST_WORKOUTS_FUZZY_QUERY = gql`
  query FuzzySearch(
    $userUid: ID!
    $offset: Int
    $limit: Int
    $searchQuery: String
  ) {
    pastWorkouts(
      userUid: $userUid
      searchQuery: $searchQuery
      limit: $limit
      offset: $offset
    ) {
      firstName
      lastName
      workoutWithExercises {
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
          multiplier
        }
      }
    }
  }
`;

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
          multiplier
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
        bodyWeight
        bodyWeightUnit
      }
    }
  }
`;

const USER_STATS_QUERY = gql`
  query UserStats($uid: ID!) {
    user(uid: $uid) {
      userStats {
        totalWorkouts
        totalExercises
        totalTime
        longestWorkout
        mostRepsInWorkout
        largestWorkCapacityKg
        topExercises
        oldestWorkoutDate
      }
    }
  }
`;

const AT_A_GLANCE_QUERY = gql`
  query AtAGlance($uid: ID!, $period: String!, $dateRange: String!) {
    user(uid: $uid) {
      atAGlance(period: $period, dateRange: $dateRange) {
        period
        dateRange
        data {
          dateRange
          elapsedSeconds
          workCapacityKg
        }
      }
    }
  }
`;
