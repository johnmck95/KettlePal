import React from "react";
import { WorkoutWithExercises } from "../../Constants/types";
import { HStack, VStack } from "@chakra-ui/react";
import ViewExercise from "./ViewExercise";
import theme from "../../Constants/theme";
import CalendarWidget from "../CalendarWidget";

export default function ViewWorkout({
  workoutWithExercises,
}: {
  workoutWithExercises: WorkoutWithExercises;
}) {
  const exercises: WorkoutWithExercises["exercises"] =
    workoutWithExercises.exercises;

  return (
    <HStack
      w={"calc(100% - 0.6rem)"}
      maxW="720px"
      p="0.5rem"
      m="0.1rem"
      borderRadius="4px"
      boxShadow={`0 0 2px ${theme.colors.olive[900]}`}
    >
      <CalendarWidget date={workoutWithExercises.createdAt} w="4rem" />
      <VStack mx="1rem">
        {exercises.map((exercise) => {
          return <ViewExercise key={exercise.uid} exercise={exercise} />;
        })}
      </VStack>
    </HStack>
  );
}
