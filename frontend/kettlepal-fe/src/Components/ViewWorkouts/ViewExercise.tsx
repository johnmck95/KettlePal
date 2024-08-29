import React from "react";
import { Exercise } from "../../Constants/types";
import { HStack, Text } from "@chakra-ui/react";
import { formatExerciseString } from "../../utils/Exercises/exercises";

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
