import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LoadingSpinner from "../Components/LoadingSpinner";
import {
  VStack,
  Flex,
  Text,
  Center,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import ViewWorkout from "../Components/ViewWorkouts/ViewWorkout";
import { useUser } from "../Contexts/UserContext";
import {
  UserWithWorkoutsQuery,
  UserWithWorkoutsQueryVariables,
} from "../generated/frontend-types";

const WORKOUTS_WITH_EXERCISES_QUERY = gql`
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

export default function PastWorkouts() {
  const { user } = useUser();
  const { loading, error, data, refetch } = useQuery<
    UserWithWorkoutsQuery,
    UserWithWorkoutsQueryVariables
  >(WORKOUTS_WITH_EXERCISES_QUERY, {
    variables: { uid: user?.uid ?? "" },
    fetchPolicy: "cache-first",
  });

  const noWorkouts = !data?.user?.workouts || data?.user?.workouts.length === 0;

  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  if (loading) {
    return (
      <Center w="100%" h="100%">
        <LoadingSpinner size={24} />;
      </Center>
    );
  }

  return (
    <Flex w="100%" flexDirection="column" alignItems={"center"}>
      {showServerError && (
        <Alert
          status="error"
          m="3rem 1rem 1rem 1rem"
          maxW="720px"
          w="calc(100% - 2rem)"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <AlertDescription>{error?.message}</AlertDescription>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}

      {!loading && !error && data && (
        <VStack w="100%" my="0.5rem">
          {data === null ? (
            <Text>No User Found</Text>
          ) : (
            <>
              {noWorkouts && <Text> Record your first workout!</Text>}
              {data?.user?.workouts?.map((workoutWithExercises) =>
                workoutWithExercises ? (
                  <ViewWorkout
                    key={workoutWithExercises.uid}
                    workoutWithExercises={workoutWithExercises}
                    refetchPastWorkouts={refetch}
                  />
                ) : null
              )}
            </>
          )}
        </VStack>
      )}
    </Flex>
  );
}
