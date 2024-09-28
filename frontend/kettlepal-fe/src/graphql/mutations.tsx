import { gql } from "@apollo/client";

/** The GQL codemon type generator is configured to create custom hooks for each
 query and mutatation is sees. Create the Query here, then call useYourQueryName 
 in the desired .tsx file. */

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      uid
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    invalidateToken
  }
`;

const ADD_WORKOUT_WITH_EXERCISES = gql`
  mutation addWorkoutWithExercises(
    $userUid: ID!
    $workoutWithExercises: AddWorkoutWithExercisesInput!
  ) {
    addWorkoutWithExercises(
      userUid: $userUid
      workoutWithExercises: $workoutWithExercises
    ) {
      uid
      userUid
      exercises {
        uid
        title
      }
    }
  }
`;

const DELETE_WORKOUT_WITH_EXERCISES = gql`
  mutation deleteWorkoutWithExercises($workoutUid: ID!) {
    deleteWorkoutWithExercises(workoutUid: $workoutUid) {
      uid
    }
  }
`;

const UPDATE_EXERCISE = gql`
  mutation updateExercise($uid: ID!, $edits: EditExerciseInput!) {
    updateExercise(uid: $uid, edits: $edits) {
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
      workoutUid
    }
  }
`;

const DELETE_EXERCISE = gql`
  mutation deleteExercise($uid: ID!) {
    deleteExercise(uid: $uid) {
      uid
    }
  }
`;

const UPDATE_WORKOUT_WITH_EXERCISES = gql`
  mutation UpdateWorkoutWithExercises(
    $workoutUid: ID!
    $workoutWithExercises: UpdateWorkoutWithExercisesInput!
  ) {
    updateWorkoutWithExercises(
      workoutUid: $workoutUid
      workoutWithExercises: $workoutWithExercises
    ) {
      date
      comment
      exercises {
        title
        reps
        sets
      }
    }
  }
`;
