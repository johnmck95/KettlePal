import React from "react";
import { Exercise } from "../../Constants/types";
import { VStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

export default function ViewExercise({
  exercise,
}: {
  exercise: Omit<Exercise, "workoutUid">;
}) {
  return (
    <VStack border="2px solid black">
      <Text>{exercise.title}</Text>
      <Text>{exercise.weight}</Text>
      <Text>{exercise.weightUnit}</Text>
      <Text>{exercise.sets}</Text>
      <Text>{exercise.reps}</Text>
      <Text>{exercise.repsDisplay}</Text>
      <Text>{exercise.comment}</Text>
      <Text>{dayjs(exercise.startTime).toString()}</Text>
      <Text>{dayjs(exercise.endTime).toString()}</Text>
    </VStack>
  );
}
