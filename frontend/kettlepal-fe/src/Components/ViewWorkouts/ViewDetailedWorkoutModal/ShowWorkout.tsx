import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { formatDurationShort, postgresToDayJs } from "../../../utils/Time/time";
import Detail from "./Detail";
import { totalWorkoutWorkCapacity } from "../../../utils/Workouts/workouts";
import { UserWithWorkoutsQuery } from "../../../generated/frontend-types";
import theme from "../../../Constants/theme";
import ViewDetailedExercise from "./ViewDetailedExercise";
import { useState } from "react";

interface ShowWorkoutProps {
  workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0];
}
export default function ShowWorkout({
  workoutWithExercises,
}: ShowWorkoutProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { comment, createdAt, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};
  return (
    <>
      {/* DATE */}
      <Text fontSize={["lg", "2xl"]} maxW="calc(100% - 75px)" overflow="scroll">
        <b>{postgresToDayJs(createdAt ?? "").format("ddd, MMM DD, YYYY")}</b>
      </Text>

      {/* WORKOUT COMMENT */}
      <Text fontSize={["sm", "md"]} color={theme.colors.grey[700]}>
        <i>{comment}</i>
      </Text>

      {/* ELAPSED TIME & TOTAL WORK CAPACITY */}
      <HStack w="100%" justifyContent="space-evenly" my="1rem">
        <Detail
          title={"Elapsed Time"}
          value={formatDurationShort(elapsedSeconds ?? 0)}
          variant="md"
        />
        <Detail
          title={"Work Capacity"}
          value={totalWorkoutWorkCapacity(workoutWithExercises)}
          variant="md"
        />
      </HStack>

      {/* SHOW DETAILS BUTTON */}
      <Button
        fontSize={["xs", "sm"]}
        width="100%"
        variant="primary"
        onClick={() => setShowDetails((prevShowDetails) => !prevShowDetails)}
        my="0.5rem"
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