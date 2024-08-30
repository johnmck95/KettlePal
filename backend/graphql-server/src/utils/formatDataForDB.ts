import dayjs from "dayjs";
import { AddOrEditWorkoutInput, AddWorkoutWithExercisesInput } from "../types";

export function formatExercisesForDB(
  workoutWithExercises: AddWorkoutWithExercisesInput
) {
  const { exercises } = workoutWithExercises;
  const formattedExercises = exercises.map((exercise) => {
    const {
      title,
      weight,
      weightUnit,
      sets,
      reps,
      repsDisplay,
      comment,
      elapsedSeconds,
    } = exercise;

    const convertedWeight = isNaN(parseFloat(weight as string))
      ? null
      : parseFloat(weight as string);

    return {
      title,
      weight: convertedWeight,
      weightUnit,
      // Frontend collects strings, but we store these values as floats in the DB.
      sets: parseFloat(sets as string),
      reps: parseFloat(reps as string),
      repsDisplay,
      comment,
      elapsedSeconds,
    };
  });

  return formattedExercises;
}

export function formatWorkoutForDB(
  workoutWithExercises: AddWorkoutWithExercisesInput,
  userUid: string
): AddOrEditWorkoutInput & { userUid: string } {
  const { createdAt, elapsedSeconds, comment } = workoutWithExercises;

  const currentTime = dayjs().format("HH:mm:ss.SSSZ");
  // Appends Hr/Min/Sec... since created add is a calendar date, only.
  const fullCreatedAt = dayjs(`${createdAt}T${currentTime}`)
    .subtract(elapsedSeconds, "seconds")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  const formattedWorkout = {
    userUid: userUid,
    createdAt: fullCreatedAt,
    elapsedSeconds,
    comment,
  };

  return formattedWorkout;
}
