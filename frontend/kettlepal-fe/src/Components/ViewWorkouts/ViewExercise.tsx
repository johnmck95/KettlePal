import React from "react";
import { Exercise } from "../../Constants/types";
import { VStack, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

export default function ViewExercise({
  exercise,
}: {
  exercise: Omit<Exercise, "workoutUid">;
}) {
  const {
    title,
    weight,
    weightUnit,
    sets,
    reps,
    repsDisplay,
    comment,
    startTime,
    endTime,
  } = exercise;

  return (
    <HStack>
      <Text>{`${title}(${weight}${weightUnit})   ${sets}x${reps}`}</Text>
    </HStack>
  );
}

// <VStack>
//   <Text>{exercise.title}</Text>
//   <Text>{exercise.weight}</Text>
//   <Text>{exercise.weightUnit}</Text>
//   <Text>{exercise.sets}</Text>
//   <Text>{exercise.reps}</Text>
//   <Text>{exercise.repsDisplay}</Text>
//   <Text>{exercise.comment}</Text>
//   <Text>{dayjs(exercise.startTime).toString()}</Text>
//   <Text>{dayjs(exercise.endTime).toString()}</Text>
// </VStack>
