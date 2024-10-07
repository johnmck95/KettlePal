import {
  AddOrEditWorkoutInput,
  AddWorkoutWithExercisesInput,
  UpdateWorkoutWithExercisesInput,
} from "../generated/backend-types";

// Function overload for ADDING a new new workout.
export function formatExercisesForDB(
  exercises: AddWorkoutWithExercisesInput["exercises"]
);
// Function overload for MUTATING a past new workout.
export function formatExercisesForDB(
  exercises: UpdateWorkoutWithExercisesInput["exercises"]
) {
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
  const { date, elapsedSeconds, comment } = workoutWithExercises;

  const formattedWorkout = {
    userUid,
    date,
    elapsedSeconds,
    comment,
  };

  return formattedWorkout;
}
