import React from "react";
import { HStack, Text } from "@chakra-ui/react";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import { Exercise } from "../../generated/frontend-types";

export default function ViewExercise({
  exercise,
}: {
  exercise: Omit<Exercise, "workoutUid">;
}) {
  return (
    <HStack w="100%">
      <Text>{formatExerciseString(exercise)}</Text>
    </HStack>
  );
}
