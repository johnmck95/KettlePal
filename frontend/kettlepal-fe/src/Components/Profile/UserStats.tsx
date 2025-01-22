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
    userStats?.topThreeExercises?.split(",").map((exercise) => {
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
        <Heading fontSize="2xl">
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
                    value={topExercises[0].name ?? ""}
                    variant="md"
                  />
                  <Detail
                    title="Days Active"
                    value={calculateTotalActiveDaysPercentage(
                      userStats?.totalWorkouts,
                      userStats?.oldestWorkoutDate,
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
                            First Imported Workout
                          </Td>
                          <Td fontSize={["xs", "sm", "md"]}>
                            {userStats?.oldestWorkoutDate}
                          </Td>
                        </Tr>
                      )}
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Total Workouts</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.totalWorkouts}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Total Exercises</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.totalExercises}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Total Active Time</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {formatTime(userStats?.totalTime ?? 0, true)}
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
                          {formatTime(userStats?.longestWorkout ?? 0, true)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>
                          Greatest Work Capacity
                        </Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.largestWorkCapacityKg?.toLocaleString()}{" "}
                          kg
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={["xs", "sm", "md"]}>Most Reps</Td>
                        <Td fontSize={["xs", "sm", "md"]}>
                          {userStats?.mostRepsInWorkout?.toLocaleString()}
                        </Td>
                      </Tr>
                    </Tbody>

                    {/* FAVOURITE EXERCISES */}

                    <Thead>
                      <Tr>
                        <Th fontSize={["xs", "sm", "md"]}>
                          FAVOURITE EXERCISES
                        </Th>
                        <Th fontSize={["xs", "sm", "md"]}> TOTAL WORKOUTS</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {topExercises.length > 0 && (
                        <Tr>
                          <Td fontSize={["xs", "sm", "md"]}>
                            #1 - {topExercises[0].name}
                          </Td>
                          <Td fontSize={["xs", "sm", "md"]}>
                            {topExercises[0].times}
                          </Td>
                        </Tr>
                      )}
                      {topExercises.length > 1 && (
                        <Tr>
                          <Td fontSize={["xs", "sm", "md"]}>
                            #2 - {topExercises[1].name}
                          </Td>
                          <Td fontSize={["xs", "sm", "md"]}>
                            {topExercises[1].times}
                          </Td>
                        </Tr>
                      )}
                      {topExercises.length > 2 && (
                        <Tr>
                          <Td fontSize={["xs", "sm", "md"]}>
                            #3 - {topExercises[2].name}
                          </Td>
                          <Td fontSize={["xs", "sm", "md"]}>
                            {topExercises[2].times}
                          </Td>
                        </Tr>
                      )}
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
