import {
  Box,
  HStack,
  Heading,
  IconButton,
  VStack,
  Text,
  Switch,
  Select,
  Center,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  TableContainer,
  Thead,
  Tbody,
  Td,
  Table,
  Tr,
  Th,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  TimeGrain,
  WorkoutAggregate,
  useProfilePageQuery,
} from "../generated/frontend-types";
import { useUser } from "../Contexts/UserContext";
import theme from "../Constants/theme";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  calculateTotalActiveDaysPercentage,
  epochToLongDateString,
  formatHrsMins,
  formatSelectedDateRange,
  formatTime,
  getCurrentWeekRange,
  getCurrentYearRange,
  getLastThreeMonthsRange,
  getUserLifetimeRange,
} from "../utils/Time/time";
import Detail from "../Components/ViewWorkouts/ViewDetailedWorkoutModal/Detail";
import LoadingSpinner from "../Components/LoadingSpinner";
import Graph from "../Components/Visualizations/Graph";

export default function Profile() {
  const navigate = useNavigate();
  const user = useUser().user;
  const [showServerError, setShowServerError] = useState<boolean>(false);
  const [bucket, setBucket] = useState<WorkoutAggregate | undefined>(undefined);
  const [showTime, setShowTime] = useState(true);
  const [showWC, setShowWC] = useState(true);
  const [grain, setGrain] = useState<
    "Daily" | "Weekly" | "Monthly" | "Annually"
  >("Weekly");

  const { loading, error, data, refetch } = useProfilePageQuery({
    variables: {
      uid: user?.uid ?? "",
      grain: TimeGrain.Day,
      range: getLastThreeMonthsRange(),
    },
  });

  useEffect(() => {
    refetch({
      uid: user?.uid ?? "",
      grain:
        grain === "Daily"
          ? TimeGrain.Day
          : grain === "Weekly"
          ? TimeGrain.Week
          : grain === "Monthly"
          ? TimeGrain.Month
          : TimeGrain.Year,
      range:
        grain === "Daily"
          ? getCurrentWeekRange()
          : grain === "Weekly"
          ? getLastThreeMonthsRange()
          : grain === "Monthly"
          ? getCurrentYearRange()
          : getUserLifetimeRange(
              user?.createdAt ?? new Date().getTime().toString()
            ),
    });
  }, [grain, refetch, user]);

  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  useEffect(() => {
    const firstBucket = data?.user?.workoutTrends?.buckets?.[0];
    if (firstBucket && !bucket) setBucket(firstBucket);
  }, [data, bucket]);

  const dataRangeShown = formatSelectedDateRange(
    bucket?.periodStart,
    bucket?.periodEnd
  );

  const memberSince = epochToLongDateString(user?.createdAt ?? "");
  const topExercises =
    data?.user?.userStats?.topExercises?.split(",").map((exercise) => {
      const [name, times] = exercise.split(" (");
      return { name, times: parseInt(times.replace(" times)", "")) };
    }) ?? [];
  const importedPastWorkouts =
    new Date(data?.user?.userStats?.oldestWorkoutDate ?? 0).getTime() <
    (Number(user?.createdAt) ?? 0);

  return (
    <VStack maxW={"1086px"} mx="auto" my="1rem">
      <HStack
        gap={4}
        w="90%"
        borderBottom={`2px solid ${theme.colors.green[100]}`}
        justifyContent="space-between"
        alignItems="center"
        p="0.5rem"
      >
        <Heading fontSize="2xl" fontWeight="bold" textAlign="center" flex="1">
          {user?.firstName + " " + user?.lastName}
        </Heading>
        <IconButton
          aria-label="Settings"
          icon={<FaCog />}
          onClick={() => navigate("/settings")}
          variant="secondary"
          size="sm"
          px={0}
          mx={0}
          flexShrink={0}
        />
      </HStack>

      <Heading
        size="md"
        fontWeight={"lighter"}
        w="90%"
        mt="0.5rem"
        px="0.25rem"
        borderBottom={`2px solid ${theme.colors.green[50]}`}
      >
        {dataRangeShown}
      </Heading>
      <HStack
        w="90%"
        justifyContent="space-evenly"
        mt="0.25rem"
        h={["42px", "52px"]}
      >
        {showTime && (
          <Detail
            title="Time"
            value={formatHrsMins(bucket?.durationSeconds ?? 0) || "0 mins"}
            variant="md"
            color={theme.colors.graphPrimary[500]}
          />
        )}
        {showWC && (
          <Detail
            title="Work Capacity"
            value={
              Math.round(bucket?.workCapacityKg ?? 0).toLocaleString() + "kg"
            }
            variant="md"
            color={theme.colors.graphSecondary[500]}
          />
        )}
      </HStack>

      {showServerError ? (
        <Alert
          status="error"
          m="0.5rem"
          w="90%"
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
      ) : (
        <Box w="100%" h={["200px", "300px"]} borderRadius="6px">
          {loading ? (
            <Center h="100%" w="100%">
              <LoadingSpinner disableMessage={true} />
            </Center>
          ) : (
            <>
              {data?.user?.workoutTrends && bucket && (
                <Graph
                  workoutTrends={data?.user?.workoutTrends}
                  showTime={showTime}
                  showWC={showWC}
                  handleBucket={setBucket}
                  bucket={bucket}
                  grain={grain}
                />
              )}
            </>
          )}
        </Box>
      )}

      <HStack
        w="90%"
        p={3}
        bg={theme.colors.white}
        borderRadius="lg"
        borderWidth={1}
        boxShadow={`0px 1px 4px ${theme.colors.grey[200]}`}
        borderColor={theme.colors.grey[200]}
        justifyContent={"space-between"}
      >
        <VStack alignItems="flex-start" w="50%" maxW="250px">
          <HStack spacing={2}>
            <Switch
              isChecked={showTime}
              onChange={(e) => setShowTime(e.target.checked)}
              colorScheme="graphPrimary"
              size={["md", "lg"]}
            />
            <Text
              fontSize={["sm", "md"]}
              fontWeight="medium"
              color={theme.colors.grey[700]}
            >
              Time
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Switch
              isChecked={showWC}
              onChange={(e) => setShowWC(e.target.checked)}
              colorScheme="graphSecondary"
              size={["md", "lg"]}
            />
            <Text
              fontSize={["sm", "md"]}
              fontWeight="medium"
              color={theme.colors.grey[700]}
            >
              Work Capacity
            </Text>
          </HStack>
        </VStack>

        <Select
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          name="grain"
          w="50%"
          maxW="250px"
          borderRadius="5px"
          value={grain}
          onChange={(e) =>
            setGrain(
              e.target.value as "Daily" | "Weekly" | "Monthly" | "Annually"
            )
          }
          focusBorderColor={theme.colors.green[300]}
          color={theme.colors.black}
        >
          {["Daily", "Weekly", "Monthly", "Annually"].map((title) => {
            return (
              <option key={title} value={title}>
                {title}
              </option>
            );
          })}
        </Select>
      </HStack>

      <VStack
        w="90%"
        pt="2rem"
        mt="2rem"
        borderTop={`2px solid ${theme.colors.green[100]}`}
      >
        <HStack w="100%" justifyContent="space-evenly" my="0.5rem">
          <Detail
            title="Total Workouts"
            value={data?.user?.userStats?.totalWorkouts.toString() ?? "0"}
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
              data?.user?.userStats?.totalWorkouts,
              data?.user?.userStats?.oldestWorkoutDate ?? undefined,
              0
            )}
            variant="md"
          />
        </HStack>
        <TableContainer>
          <Table
            variant="simple"
            w="100%"
            sx={{ tableLayout: "fixed" }}
            my="0.5rem"
            size={["xs", "sm", "md"]}
          >
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
                  <Td fontSize={["xs", "sm", "md"]}>First Recorded Workout</Td>
                  <Td fontSize={["xs", "sm", "md"]}>
                    {data?.user?.userStats?.oldestWorkoutDate ?? "---"}
                  </Td>
                </Tr>
              )}
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Total Workouts</Td>
                <Td fontSize={["xs", "sm", "md"]}>
                  {data?.user?.userStats?.totalWorkouts.toLocaleString()}
                </Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Total Exercises</Td>
                <Td fontSize={["xs", "sm", "md"]}>
                  {data?.user?.userStats?.totalExercises.toLocaleString()}
                </Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Total Active Time</Td>
                <Td fontSize={["xs", "sm", "md"]}>
                  {data?.user?.userStats?.totalTime
                    ? formatTime(data?.user?.userStats?.totalTime, true)
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
                  {data?.user?.userStats?.longestWorkout
                    ? formatTime(data?.user?.userStats?.longestWorkout, true)
                    : "---"}
                </Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Greatest Work Capacity</Td>
                <Td fontSize={["xs", "sm", "md"]}>
                  {Math.round(
                    data?.user?.userStats?.largestWorkCapacityKg ?? 0
                  ).toLocaleString() ?? 0}{" "}
                  kg
                </Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Most Reps</Td>
                <Td fontSize={["xs", "sm", "md"]}>
                  {data?.user?.userStats?.mostRepsInWorkout?.toLocaleString() ??
                    0}
                </Td>
              </Tr>
            </Tbody>

            {/* FAVOURITE EXERCISES */}
            {topExercises.length > 0 && (
              <Thead>
                <Tr>
                  <Th fontSize={["xs", "sm", "md"]}>FAVOURITE EXERCISES</Th>
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
      </VStack>
    </VStack>
  );
}
