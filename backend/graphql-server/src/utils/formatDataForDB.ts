import dayjs from "dayjs";
import {
  AddOrEditWorkoutInput,
  AddWorkoutWithExercisesInput,
  UpdateWorkoutWithExercisesInput,
} from "../generated/backend-types";

// Frontend collects YYYY-MM-DD.
// This adds the current HH:MM:SS:SSSZ less the elapsed seconds.
function formatCreatedAt(createdAt: string, elapsedSeconds: number) {
  const currentTime = dayjs().format("HH:mm:ss.SSSZ");
  const fullCreatedAt = dayjs(`${createdAt}T${currentTime}`)
    .subtract(elapsedSeconds, "seconds")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  return fullCreatedAt;
}

export function formatExercisesForDB({
  exercises,
  createdAt,
  workoutElapsedSeconds,
}: {
  exercises:
    | AddWorkoutWithExercisesInput["exercises"]
    | UpdateWorkoutWithExercisesInput["exercises"];
  createdAt: string | null;
  workoutElapsedSeconds: number | null;
}) {
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

    return {
      uid: exercise.uid ?? null,
      title,
      weight: isNaN(parseFloat(weight as string))
        ? null
        : parseFloat(weight as string),
      weightUnit: weightUnit !== "" ? weightUnit : null,
      // Frontend collects strings, but we store these values as floats in the DB.
      sets: isNaN(parseFloat(sets as string))
        ? null
        : parseFloat(sets as string),
      reps: isNaN(parseFloat(reps as string))
        ? null
        : parseFloat(reps as string),
      repsDisplay: repsDisplay !== "" ? repsDisplay : null,
      comment: comment !== "" ? comment : null,
      elapsedSeconds,
      createdAt:
        createdAt !== null && workoutElapsedSeconds !== null
          ? formatCreatedAt(createdAt, workoutElapsedSeconds)
          : null,
    };
  });

  return formattedExercises;
}

export function formatWorkoutForDB(
  workoutWithExercises: AddWorkoutWithExercisesInput,
  userUid: string
): AddOrEditWorkoutInput & { userUid: string } {
  const { createdAt, elapsedSeconds, comment } = workoutWithExercises;

  const formattedWorkout = {
    userUid: userUid,
    createdAt: formatCreatedAt(createdAt, elapsedSeconds),
    elapsedSeconds,
    comment,
  };

  return formattedWorkout;
}
