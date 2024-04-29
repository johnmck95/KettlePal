import React from "react";
import { WorkoutWithExercises } from "../../Constants/types";
import { VStack } from "@chakra-ui/react";
import ViewExercise from "./ViewExercise";

export default function ViewWorkout({
  workoutWithExercises,
}: {
  workoutWithExercises: WorkoutWithExercises;
}) {
  const exercises: WorkoutWithExercises["exercises"] =
    workoutWithExercises.exercises;

  return (
    <VStack>
      {exercises.map((exercise) => {
        return <ViewExercise key={exercise.uid} exercise={exercise} />;
      })}
    </VStack>
  );
}
