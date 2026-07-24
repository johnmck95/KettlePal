import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { formatDurationShort } from "../../../utils/Time/time";
import { FuzzySearchQuery } from "../../../generated/frontend-types";
import theme from "../../../Constants/theme";
import ViewDetailedExercise from "./ViewDetailedExercise";
import { useState } from "react";
import dayjs from "dayjs";
import { totalWorkoutWorkCapacity } from "../../../utils/Workouts/workouts";
import KeyMetricCard from "../../KeyMetricCard";

interface ShowWorkoutProps {
  workoutWithExercises: NonNullable<
    NonNullable<FuzzySearchQuery["pastWorkouts"]>["workoutWithExercises"]
  >[0];
  focusRef?: React.MutableRefObject<null>;
}
export default function ShowWorkout({
  workoutWithExercises,
  focusRef,
}: ShowWorkoutProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { comment, date, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};
  return (
    <>
      {/* DATE */}
      <Flex w="100%" h="36px" alignItems="flex-end">
        <Text fontSize={["lg", "xl", "2xl"]} maxW="calc(100% - 75px)">
          <b>{dayjs(date).format("ddd, MMM DD, YYYY")}</b>
        </Text>
      </Flex>

      {/* WORKOUT COMMENT */}
      <Text fontSize={["sm", "md"]} color={theme.colors.grey[700]}>
        <i>{comment}</i>
      </Text>

      {/* ELAPSED TIME & TOTAL WORK CAPACITY */}
      <HStack spacing={[2, 4]} w="100%" my={4}>
        <Box w="50%">
          <KeyMetricCard
            metric="time"
            value={formatDurationShort(elapsedSeconds ?? 0)}
          />
        </Box>
        <Box w="50%">
          <KeyMetricCard
            metric="workCapacity"
            value={totalWorkoutWorkCapacity(workoutWithExercises)}
          />
        </Box>
      </HStack>

      {/* SHOW DETAILS BUTTON */}
      <Button
        fontSize={["xs", "sm"]}
        width="100%"
        variant="primary"
        onClick={() => setShowDetails((prevShowDetails) => !prevShowDetails)}
        my="0.5rem"
        borderRadius="full"
        h="2rem"
        ref={focusRef}
        sx={{
          _focus: {
            borderColor: theme.colors.green[300],
            boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
          },
        }}
      >
        {showDetails ? "Hide" : "Show"} Details
      </Button>
      <Box width="100%" margin="0" padding="0">
        {/* EXERCISES */}
        {exercises?.map((exercise) => (
          <ViewDetailedExercise
            key={exercise.uid}
            exercise={exercise}
            showDetails={showDetails}
          />
        ))}
      </Box>
    </>
  );
}
