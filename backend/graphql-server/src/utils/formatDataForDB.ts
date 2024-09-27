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

// Function overload for ADDING a new new workout.
export function formatExercisesForDB({
  exercises,
  createdAt,
  workoutElapsedSeconds,
}: {
  exercises: AddWorkoutWithExercisesInput["exercises"];
  createdAt: string | null;
  workoutElapsedSeconds: number | null;
});
// Function overload for MUTATING a past new workout.
export function formatExercisesForDB({
  exercises,
  createdAt,
  workoutElapsedSeconds,
}: {
  exercises: UpdateWorkoutWithExercisesInput["exercises"];
  createdAt: string | null;
  workoutElapsedSeconds: number | null;
}) {
  const formattedExercises = exercises.map((exercise) => {
    const {
      uid,
      title,
      weight,
      weightUnit,
      sets,
      reps,
      repsDisplay,
      comment,
      elapsedSeconds,
    } = exercise;

    const baseExercise = {
      title,
      weight: isNaN(parseFloat(weight as string))
        ? null
        : parseFloat(weight as string),
      weightUnit: weightUnit !== "" ? weightUnit : null,
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

    // UID will only exist when updting an exercise.
    // Let the DB generate a UID for new exercises.
    return uid ? { uid, ...baseExercise } : baseExercise;
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
