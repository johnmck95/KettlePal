import React from "react";
import { Exercise } from "../../Constants/types";
import { VStack, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { formatReps } from "../../Functions/Exercises/exercises";

export default function ViewExercise({
  exercise,
}: {
  exercise: Omit<Exercise, "workoutUid">;
}) {
  const { title, weight, weightUnit, sets, reps, repsDisplay } = exercise;

  return (
    <HStack w="100%">
      <Text>{`${title} (${weight}${weightUnit}):   ${sets}x${formatReps(
        reps,
        repsDisplay
      )} `}</Text>
    </HStack>
  );
}
