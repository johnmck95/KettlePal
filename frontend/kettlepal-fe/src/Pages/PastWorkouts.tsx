import React from "react";
import { useUser } from "../Contexts/UserContext";
import { useQuery, gql } from "@apollo/client";
import LoadingSpinner from "../Components/LoadingSpinner";
import { VStack, Center, Flex, Text } from "@chakra-ui/react";
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
          startTime
          endTime
        }
      }
    }
  }
`;

export default function PastWorkouts() {
  const user = useUser();
  const { loading, error, data, refetch } = useQuery<UserWithWorkouts>(
    WORKOUTS_WITH_EXERCISES_QUERY,
    {
      variables: { uid: user.uid },
    }
  );

  const noWorkouts = !data?.user?.workouts;

  if (loading) {
    return <LoadingSpinner size={24} />;
  }

  return (
    <Flex w="100%">
      {error && <Text>An Unexpected Error has occurred: {error?.message}</Text>}
      {!loading && !error && data && (
        <VStack w="100%" my="0.5rem">
          {data === null ? (
            <Text>No User Found</Text>
          ) : (
            <>
              {noWorkouts && <Text> Record your first workout!</Text>}
              {data?.user?.workouts?.map(
                (workoutWithExercises: WorkoutWithExercises) => (
                  <ViewWorkout
                    key={workoutWithExercises.uid}
                    workoutWithExercises={workoutWithExercises}
                    refetchPastWorkouts={refetch}
                  />
                )
              )}
            </>
          )}
        </VStack>
      )}
    </Flex>
  );
}
