import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Button,
} from "@chakra-ui/react";
import ViewWorkout from "../Components/ViewWorkouts/ViewWorkout";
import { useUser } from "../Contexts/UserContext";
import { useUserWithWorkoutsQuery } from "../generated/frontend-types";
import { NetworkStatus } from "@apollo/client";

export default function PastWorkouts() {
  const { user } = useUser();
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const scrollPositionRef = useRef(0);

  const { loading, error, data, refetch, fetchMore, networkStatus } =
    useUserWithWorkoutsQuery({
      variables: {
        uid: user?.uid ?? "",
        offset: 0,
        limit: limit,
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    });

  const isInitialLoading = loading && networkStatus === NetworkStatus.loading;
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  // Check if there are more workouts to load on initial load
  useEffect(() => {
    if (data?.user?.workouts) {
      setHasMore(data.user.workouts.length >= limit);
    }
  }, [data, limit]);

  const loadMoreWorkouts = useCallback(() => {
    if (!hasMore) {
      return;
    }

    // Store current scroll position
    scrollPositionRef.current = window.scrollY;

    // Fetch more data, Apollo Cache policy responsible for appending this to data.
    fetchMore({
      variables: {
        offset: data?.user?.workouts?.length || 0,
        limit: limit,
      },
    }).then((fetchMoreResult) => {
      const newWorkouts = fetchMoreResult.data.user?.workouts || [];
      if (newWorkouts.length < limit) {
        setHasMore(false);
      }

      // Restore scroll position after data is loaded and DOM is updated
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    });
  }, [hasMore, fetchMore, limit, data?.user?.workouts?.length]);

  const noWorkouts = !data?.user?.workouts || data?.user?.workouts.length === 0;

  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  if (isInitialLoading) {
    return (
      <Center w="100%" h="100%">
        <LoadingSpinner size={24} />
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

      {data && (
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
          {hasMore && (
            <Button
              onClick={loadMoreWorkouts}
              isLoading={isFetchingMore || isInitialLoading}
              variant="secondary"
            >
              {isFetchingMore || isInitialLoading ? "Loading..." : "Load More"}
            </Button>
          )}
        </VStack>
      )}
    </Flex>
  );
}
