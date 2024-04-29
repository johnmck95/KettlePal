import React from "react";
import { useUser } from "../Contexts/UserContext";
import { useQuery, gql } from "@apollo/client";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Box, VStack, Center, Flex, Text } from "@chakra-ui/react";
import { UserWithWorkouts, WorkoutWithExercises } from "../Constants/types";
import ViewWorkout from "../Components/ViewWorkouts/ViewWorkout";

const WORKOUTS_WITH_EXERCISES_QUERY = gql`
  query UserWithWorkouts($uid: ID!) {
    user(uid: $uid) {
      firstName
      lastName
      workouts {
        uid
        comment
        startTime
        endTime
        exercises {
          uid
          title
          weight
          weightUnit
          sets
          reps
          repsDisplay
          comment
          startTime
          endTime
        }
      }
    }
  }
`;

export default function PastWorkouts() {
  const user = useUser();
  const { loading, error, data } = useQuery<UserWithWorkouts>(
    WORKOUTS_WITH_EXERCISES_QUERY,
    {
      variables: { uid: user.uid },
    }
  );

  return (
    <Flex w="100%">
      {loading && (
        <Center w="100%" h="4rem" my="1rem">
          <LoadingSpinner />
        </Center>
      )}
      {error && <Text>An Unexpected Error has occurred: {error.message}</Text>}
      {!loading && !error && data && (
        <VStack w="100%">
          {data === null ? (
            <Text>No User Found</Text>
          ) : (
            data.user.workouts.map(
              (workoutWithExercises: WorkoutWithExercises) => (
                <ViewWorkout
                  key={workoutWithExercises.uid}
                  workoutWithExercises={workoutWithExercises}
                />
              )
            )
          )}
        </VStack>
      )}
    </Flex>
  );
}
