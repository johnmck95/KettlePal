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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  TimeGrain,
  WorkoutAggregate,
  useWorkoutTrendsQuery,
} from "../generated/frontend-types";
import { useUser } from "../Contexts/UserContext";
import theme from "../Constants/theme";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  formatHrsMins,
  formatSelectedDateRange,
  getCurrentWeekRange,
  getCurrentYearRange,
  getLastThreeMonthsRange,
  getUserLifetimeRange,
} from "../utils/Time/time";
import Detail from "../Components/ViewWorkouts/ViewDetailedWorkoutModal/Detail";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function Profile() {
  const navigate = useNavigate();
  const user = useUser().user;
  const [bucket, setBucket] = useState<WorkoutAggregate | undefined>(undefined);
  const [showTime, setShowTime] = useState(true);
  const [showWC, setShowWC] = useState(true);
  const [grain, setGrain] = useState<
    "Daily" | "Weekly" | "Monthly" | "Annually"
  >("Weekly");

  // TODO:
  // 1. Now that UI controls exist, configure them to format the query variables properly
  // 2. Create the visualization that shows the data

  const { loading, error, data, refetch } = useWorkoutTrendsQuery({
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

  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  useEffect(() => {
    if (data && data.user && data.user.workoutTrends.buckets.length > 0) {
      setBucket(
        data.user.workoutTrends.buckets[
          data.user.workoutTrends.buckets.length - 1
        ]
      );
    }
  }, [data]);

  const dataRangeShown = formatSelectedDateRange(
    bucket?.periodStart,
    bucket?.periodEnd
  );

  return (
    <VStack maxW={"1086px"} mx="auto" my="1rem">
      <HStack
        gap={4}
        w="90%"
        borderBottom={`2px solid ${theme.colors.green[100]}`}
        justifyContent={"center"}
        alignItems={"center"}
        p="0.5rem"
      >
        <Heading fontSize="2xl" fontWeight="bold" textAlign="center">
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
      <HStack w="90%" justifyContent="space-evenly">
        <Detail
          title="Time"
          value={formatHrsMins(bucket?.durationSeconds ?? 0) || "0 mins"}
          variant="md"
          color={theme.colors.graphPrimary[500]}
        />
        <Detail
          title="Work Capacity"
          value={
            Math.round(bucket?.workCapacityKg ?? 0).toLocaleString() + "kg"
          }
          variant="md"
          color={theme.colors.graphSecondary[500]}
        />
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
        <Box
          w="90%"
          h="200px"
          border={`2px solid ${theme.colors.grey[300]}`}
          borderRadius="6px"
        >
          {loading ? (
            <Center h="100%" w="100%">
              <LoadingSpinner disableMessage={true} />
            </Center>
          ) : (
            <Text
              fontSize="lg"
              fontWeight="medium"
              color={theme.colors.grey[500]}
              textAlign="center"
              pt="80px"
            >
              [Graph Visualization Placeholder]
            </Text>
          )}
        </Box>
      )}

      <HStack
        w="90%"
        p={2}
        bg="grey.50"
        borderRadius="lg"
        borderWidth={1}
        borderColor="grey.200"
      >
        <VStack alignItems="flex-start" w="50%">
          <HStack spacing={2}>
            <Switch
              isChecked={showTime}
              onChange={(e) => setShowTime(e.target.checked)}
              colorScheme="graphPrimary"
              size={["md", "lg"]}
            />
            <Text fontSize={["sm", "md"]} fontWeight="medium" color="grey.700">
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
            <Text fontSize={["sm", "md"]} fontWeight="medium" color="grey.700">
              Work Capacity
            </Text>
          </HStack>
        </VStack>

        <Select
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          name="grain"
          w="50%"
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
    </VStack>
  );
}
