import React from "react";
import { Exercise } from "../../Constants/types";
import { HStack, Text } from "@chakra-ui/react";
import { formatReps } from "../../utils/Exercises/exercises";

export default function ViewExercise({
  exercise,
}: {
  exercise: Omit<Exercise, "workoutUid">;
}) {
  const { title, weight, weightUnit, sets, reps, repsDisplay, comment } =
    exercise;

  return (
    <HStack w="100%">
      {weight && weightUnit && sets && reps && repsDisplay ? (
        <Text>{`${title} (${weight}${weightUnit}):    ${sets}x${formatReps(
          reps,
          repsDisplay
        )} `}</Text>
      ) : (
        <Text>{`${title}:    ${comment}`}</Text>
      )}
    </HStack>
  );
}
