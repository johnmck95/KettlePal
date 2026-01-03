import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { formatDurationShort } from "../../../utils/Time/time";
import Detail from "./Detail";
import { FuzzySearchQuery } from "../../../generated/frontend-types";
import theme from "../../../Constants/theme";
import ViewDetailedExercise from "./ViewDetailedExercise";
import { useState } from "react";
import dayjs from "dayjs";
import { totalWorkoutWorkCapacity } from "../../../utils/Workouts/workouts";

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
      <HStack w="100%" justifyContent="space-evenly" my="1rem">
        <Detail
          title={"Time"}
          value={formatDurationShort(elapsedSeconds ?? 0)}
          variant="md"
          color={theme.colors.graphPrimary[500]}
        />
        <Detail
          title={"Work Capacity"}
          value={totalWorkoutWorkCapacity(workoutWithExercises)}
          variant="md"
          color={theme.colors.graphSecondary[500]}
        />
      </HStack>

      {/* SHOW DETAILS BUTTON */}
      <Button
        fontSize={["xs", "sm"]}
        width="100%"
        variant="primary"
        onClick={() => setShowDetails((prevShowDetails) => !prevShowDetails)}
        my="0.5rem"
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
      <Box
        width="100%"
        margin="0"
        padding="0"
        sx={{
          "& > *:not(:first-of-type)": {
            borderTop: showDetails
              ? `1px solid ${theme.colors.feldgrau[100]}`
              : "none",
          },
        }}
      >
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
