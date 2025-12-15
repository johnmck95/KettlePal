import {
  AddExerciseInput,
  AddOrEditWorkoutInput,
  AddWorkoutWithExercisesInput,
  UpdateExerciseInput,
  UpdateWorkoutWithExercisesInput,
} from "../generated/backend-types";

export interface FormattedExercise {
  uid?: string;
  title: string;
  weight: number | null;
  weightUnit: string | null | undefined;
  sets: number | null;
  reps: number | null;
  repsDisplay: string | null | undefined;
  comment: string | null | undefined;
  elapsedSeconds: number | null | undefined;
  multiplier: number | null | undefined;
}

type ExerciseInput = AddExerciseInput | UpdateExerciseInput;

export type FormattedWorkout = AddOrEditWorkoutInput & { userUid: string };

export function formatExercisesForDB(
  exercises: AddWorkoutWithExercisesInput["exercises"]
): FormattedExercise[];
export function formatExercisesForDB(
  exercises: UpdateWorkoutWithExercisesInput["exercises"]
): FormattedExercise[];
export function formatExercisesForDB(
  exercises:
    | AddWorkoutWithExercisesInput["exercises"]
    | UpdateWorkoutWithExercisesInput["exercises"]
): FormattedExercise[] {
  const formattedExercises: FormattedExercise[] = exercises
    .filter((exercise): exercise is ExerciseInput => exercise != null)
    .map((exercise) => {
      const {
        title,
        weight,
        weightUnit,
        sets,
        reps,
        repsDisplay,
        comment,
        elapsedSeconds,
        multiplier,
      } = exercise as ExerciseInput;

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
        multiplier,
      };

      // UID will only exist when updating an exercise.
      if (exercise && "uid" in exercise && typeof exercise.uid === "string") {
        return { uid: exercise.uid, ...baseExercise };
      }
      // Let the DB generate a UID for new exercises.
      return baseExercise;
    });

  return formattedExercises;
}

export function formatWorkoutForDB(
  workoutWithExercises: AddWorkoutWithExercisesInput,
  userUid: string
): FormattedWorkout {
  const { date, elapsedSeconds, comment } = workoutWithExercises;

  const formattedWorkout = {
    userUid,
    date,
    elapsedSeconds,
    comment,
  };

  return formattedWorkout;
}
