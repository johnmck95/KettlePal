import React from "react";
import { HStack, Text } from "@chakra-ui/react";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import { Exercise } from "../../generated/frontend-types";

// Wraps all case-insensitive substring occurrences of the query in <b> tags
export function boldExerciseStringByQuery(
  exerciseString: string,
  searchQuery: string
): React.ReactNode {
  if (!searchQuery) return exerciseString;

  const regex = new RegExp(`(${searchQuery})`, "gi");

  return exerciseString
    .split(regex)
    .map((subString, index) =>
      regex.test(subString) ? <b key={index}>{subString}</b> : subString
    );
}

export default function ViewExercise({
  exercise,
  searchQuery,
}: {
  exercise: Omit<Exercise, "workoutUid">;
  searchQuery: string;
}) {
  return (
    <HStack w="100%">
      <Text>
        {boldExerciseStringByQuery(formatExerciseString(exercise), searchQuery)}
      </Text>
    </HStack>
  );
}
