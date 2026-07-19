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
import { FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  calculateTotalActiveDaysPercentage,
  epochToLongDateString,
  formatHrsMins,
  formatSelectedDateRange,
  formatTime,
  getCurrentWeekRange,
  getLastTwelveMonthsRange,
  getLastThreeMonthsRange,
  getUsersAnnualRange,
  isNextRangeInFuture,
} from "../utils/Time/time";
import Detail from "../Components/ViewWorkouts/ViewDetailedWorkoutModal/Detail";
import LoadingSpinner from "../Components/LoadingSpinner";
import WorkoutTrendsGraph from "../Components/Visualizations/WorkoutTrendsGraph";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import ExerciseTrends from "../Components/ExerciseTrends";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function getDefaultRangeForGrain(
  grain: "Daily" | "Weekly" | "Monthly" | "Annually",
  userCreatedAt?: string
) {
  switch (grain) {
    case "Daily":
      return getCurrentWeekRange();

    case "Weekly":
      return getLastThreeMonthsRange();

    case "Monthly":
      return getLastTwelveMonthsRange();

    case "Annually":
      return getUsersAnnualRange(userCreatedAt ?? "");

    default:
      return getLastThreeMonthsRange();
  }
}

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
  const [range, setRange] = useState(getLastThreeMonthsRange());

  const { loading, error, data, refetch } = useProfilePageQuery({
    variables: {
      uid: user?.uid ?? "",
      grain: TimeGrain.Day,
      range: getLastThreeMonthsRange(),
    },
  });

  useEffect(() => {
    setRange(getDefaultRangeForGrain(grain, user?.createdAt));
  }, [grain, user?.createdAt]);

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
      range,
    });
  }, [grain, range, refetch, user?.uid]);

  const shiftRange = (direction: -1 | 1) => {
    const currentStart = dayjs(range.start);
    const currentEnd = dayjs(range.end);

    switch (grain) {
      // Data aggregated per day. Shifted 1 day at a time.
      case "Daily": {
        setRange({
          start: currentStart.add(direction, "day").format("YYYY-MM-DD"),
          end: currentEnd.add(direction, "day").format("YYYY-MM-DD"),
        });
        break;
      }

      // Data aggregated per week (mon-sun). 13 total weeks shown at once, shifted by 1-week blocks.
      case "Weekly": {
        const baseStart = dayjs(range.start).startOf("isoWeek");
        const baseEnd = dayjs(range.end).endOf("isoWeek");

        const nextStart = baseStart.add(direction, "week");
        const nextEnd = baseEnd.add(direction, "week");

        setRange({
          start: nextStart.startOf("isoWeek").format("YYYY-MM-DD"),
          end: nextEnd.endOf("isoWeek").format("YYYY-MM-DD"),
        });
        break;
      }

      // Data aggregated per month. 12 calendar months backwards from the end of current month. Shifted monthly.
      case "Monthly": {
        const baseStart = dayjs(range.start).startOf("month");
        const baseEnd = dayjs(range.end).endOf("month");

        const nextStart = baseStart.add(direction, "month");
        const nextEnd = baseEnd.add(direction, "month");

        setRange({
          start: nextStart.startOf("month").format("YYYY-MM-DD"),
          end: nextEnd.endOf("month").format("YYYY-MM-DD"),
        });
        break;
      }

      // Data aggregated per calendar year.
      case "Annually": {
        const baseStart = dayjs(range.start).startOf("year");
        const baseEnd = dayjs(range.end).endOf("year");

        const nextStart = baseStart.add(direction, "year");
        const nextEnd = baseEnd.add(direction, "year");

        setRange({
          start: nextStart.startOf("year").format("YYYY-MM-DD"),
          end: nextEnd.endOf("year").format("YYYY-MM-DD"),
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  useEffect(() => {
    if (!data?.user?.workoutTrends?.buckets) {
      return;
    }

    const today = dayjs();

    const todayBucket = data.user.workoutTrends.buckets.find((bucket) => {
      return (
        today.isSameOrAfter(dayjs(bucket.periodStart), "day") &&
        today.isSameOrBefore(dayjs(bucket.periodEnd), "day")
      );
    });

    if (todayBucket) {
      setBucket(todayBucket);
    } else {
      setBucket(
        data.user.workoutTrends.buckets[
          data.user.workoutTrends.buckets.length - 1
        ]
      );
    }
  }, [data?.user?.workoutTrends?.buckets]);

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

      {/* WEEKLY PROGRESS GRAPH */}
      <Heading
        size={["md", "lg"]}
        color={theme.colors.grey[700]}
        fontWeight={400}
        textDecoration="underline"
        textDecorationColor={theme.colors.grey[300]}
        mt={["1.25rem", "2rem"]}
      >
        Workout Trends
      </Heading>
      <HStack
        w="90%"
        mt="0.75rem"
        pb="0.25rem"
        px="0.25rem"
        justifyContent="space-between"
      >
        <IconButton
          aria-label="Previous period"
          icon={<FaChevronLeft />}
          onClick={() => shiftRange(-1)}
          variant="ghost"
          size="md"
          bg={theme.colors.white}
          borderRadius="full"
          border={`1px solid ${theme.colors.grey[300]}`}
          boxShadow="sm"
          _hover={{
            borderColor: theme.colors.grey[400],
          }}
          _active={{
            borderColor: theme.colors.grey[500],
          }}
        />

        <Heading
          size="md"
          fontWeight={500}
          color={theme.colors.grey[700]}
          textAlign="center"
        >
          {dataRangeShown}
        </Heading>

        <IconButton
          aria-label="Next period"
          icon={<FaChevronRight />}
          onClick={() => shiftRange(1)}
          isDisabled={isNextRangeInFuture(grain, range)}
          variant="ghost"
          size="md"
          bg={theme.colors.white}
          borderRadius="full"
          border={`1px solid ${theme.colors.grey[300]}`}
          boxShadow="sm"
          mt="0.25rem"
          _hover={{
            borderColor: theme.colors.grey[400],
          }}
          _active={{
            borderColor: theme.colors.grey[500],
          }}
        />
      </HStack>
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
        <Box w="100%" h="100%" borderRadius="6px">
          {loading ? (
            <Center h="100%" w="100%">
              <LoadingSpinner disableMessage={true} />
            </Center>
          ) : (
            <>
              {data?.user?.workoutTrends && bucket && (
                <WorkoutTrendsGraph
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
        <VStack w="50%" maxW="250px" alignItems={"flex-start"}>
          <Text
            fontSize={["sm", "md"]}
            fontWeight="medium"
            color={theme.colors.grey[700]}
          >
            Granularity
          </Text>
          <Select
            size={["sm", "sm", "md"]}
            fontSize={["16px"]}
            name="grain"
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
        </VStack>
      </HStack>

      {/* EXERCISE GRAPH */}

      <ExerciseTrends />

      {/* LIFETIME TOTALS */}
      <VStack w="90%" mt="2.5rem">
        <Heading
          pb="1rem"
          size={["md", "lg"]}
          color={theme.colors.grey[700]}
          fontWeight={400}
          textDecoration="underline"
          textDecorationColor={theme.colors.grey[300]}
        >
          Lifetime Statistics
        </Heading>
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
