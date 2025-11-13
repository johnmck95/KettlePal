import {
  Box,
  Heading,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useUser } from "../../Contexts/UserContext";
import theme from "../../Constants/theme";
import Detail from "../ViewWorkouts/ViewDetailedWorkoutModal/Detail";
import {
  epochToLongDateString,
  formatTime,
  calculateTotalActiveDaysPercentage,
} from "../../utils/Time/time";
import { useUserStatsQuery } from "../../generated/frontend-types";
import LoadingSpinner from "../LoadingSpinner";

export default function UserStats() {
  const user = useUser().user;
  const memberSince = epochToLongDateString(user?.createdAt ?? "");
  const { loading, error, data } = useUserStatsQuery({
    variables: {
      uid: user?.uid ?? "",
    },
  });
  const userStats = data?.user?.userStats;
  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  const topExercises =
    userStats?.topExercises?.split(",").map((exercise) => {
      const [name, times] = exercise.split(" (");
      return { name, times: parseInt(times.replace(" times)", "")) };
    }) ?? [];

  const importedPastWorkouts =
    new Date(userStats?.oldestWorkoutDate ?? 0).getTime() <
    (Number(user?.createdAt) ?? 0);

  return (
    <Box
      h="100%"
      bg={theme.colors.white}
      borderRadius="8px"
      boxShadow={`0px 0.5px 1px ${theme.colors.grey[400]}`}
      p="0"
    >
      <VStack py="1rem">
        <Heading
          w="90%"
          fontSize="2xl"
          fontWeight="bold"
          pb="0.5rem"
          mb="0.5rem"
          textAlign="center"
          borderBottom={`1px solid ${theme.colors.green[50]}`}
        >
          {user?.firstName + " " + user?.lastName}
        </Heading>
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
        {loading ? (
          <Center w="100%" minH="50vh">
            <LoadingSpinner size={16} disableMessage={true} />
          </Center>
        ) : (
          <>
            {data && (
              <>
                <HStack w="100%" justifyContent="space-evenly" my="1rem">
                  <Detail
                    title="Total Workouts"
                    value={userStats?.totalWorkouts.toString() ?? "0"}
                    variant="md"
                  />
                  <Detail
                    title="Favourite Exercise"
                    value={topExercises[0]?.name ?? "---"}
                    variant="md"
                  />
                  <Detail
                    title="Days Active"
                    value={calculateTotalActiveDaysPercentage(
                      userStats?.totalWorkouts,
                      userStats?.oldestWorkoutDate ?? undefined,
                      0
                    )}
                    variant="md"
                  />
                </HStack>

                <TableContainer>
                  <Table variant="simple" size={["xs", "sm", "md"]}>
                    {/* LIFETIME TOTAL */}
                    <Thead>
                      <Tr>
                        <Th fontSize={["xl"]}>Lifetime Totals</Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Member Since</Td>
                        <Td fontSize={["xs", "sm", "md"]}>{memberSince}</Td>
                      </Tr>
                      {importedPastWorkouts && (
                        <Tr>
                          <Td fontSize={["xs", "sm", "md"]}>
                            First Recorded Workout
                          </Td>
                          <Td fontSize={["xs", "sm", "md"]}>
                            {userStats?.oldestWorkoutDate ?? "---"}
                          </Td>
                        </Tr>
                      )}
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Total Workouts</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.totalWorkouts.toLocaleString()}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Total Exercises</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.totalExercises.toLocaleString()}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Total Active Time</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.totalTime
                            ? formatTime(userStats?.totalTime, true)
                            : "---"}
                        </Td>
                      </Tr>
                    </Tbody>

                    {/* BEST EFFORTS */}
                    <Thead>
                      <Tr>
                        <Th fontSize={["xs", "sm", "md"]}>BEST EFFORTS</Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Longest Workout</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.longestWorkout
                            ? formatTime(userStats?.longestWorkout, true)
                            : "---"}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>
                          Greatest Work Capacity
                        </Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {Math.round(
                            userStats?.largestWorkCapacityKg ?? 0
                          ).toLocaleString() ?? 0}{" "}
                          kg
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Most Reps</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.mostRepsInWorkout?.toLocaleString() ?? 0}
                        </Td>
                      </Tr>
                    </Tbody>

                    {/* FAVOURITE EXERCISES */}
                    {topExercises.length > 0 && (
                      <Thead>
                        <Tr>
                          <Th fontSize={["xs", "sm", "md"]}>
                            FAVOURITE EXERCISES
                          </Th>
                          <Th fontSize={["xs", "sm", "md"]}> TOTAL WORKOUTS</Th>
                        </Tr>
                      </Thead>
                    )}
                    <Tbody>
                      {topExercises.map((exercise, index) => {
                        return (
                          <Tr key={index}>
                            <Td fontSize={["xs", "sm", "md"]}>
                              #{index + 1} - {exercise?.name}
                            </Td>
                            <Td fontSize={["xs", "sm", "md"]}>
                              {exercise.times.toLocaleString()}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
