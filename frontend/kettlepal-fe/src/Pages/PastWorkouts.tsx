import React from "react";
import { useUser } from "../Contexts/UserContext";
import { useQuery, gql } from "@apollo/client";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Box, Center, Text } from "@chakra-ui/react";
import { UserWithWorkouts } from "../Constants/types";

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
    <Box>
      {loading && (
        <Center w="100%" h="4rem" my="1rem">
          <LoadingSpinner />
        </Center>
      )}
      {error && <Text>An Unexpected Error has occurred: {error.message}</Text>}
      {!loading && !error && data && (
        <Text>
          {data === null && <Text> No User Found </Text>}
          {data.user.firstName} {data.user.lastName}
        </Text>
      )}
    </Box>
  );
}
