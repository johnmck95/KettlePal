import { ChangeEvent, useState } from "react";
import { FuzzySearchQuery } from "../generated/frontend-types";
import {
  ExerciseErrorsMessages,
  ValidationResult,
  WorkoutErrorsMessages,
} from "./useCreateWorkoutForm";

export type UpdateWorkoutState = {
  date: { value: string; errors: string[] };
  comment: { value: string; errors: string[] };
  elapsedSeconds: { value: number; errors: string[] };
  exercises: Array<{
    uid: string;
    title: { value: string; errors: string[] };
    weight: { value: string; errors: string[] };
    weightUnit: { value: string; errors: string[] };
    sets: { value: string; errors: string[] };
    reps: { value: string; errors: string[] };
    repsDisplay: { value: string; errors: string[] };
    comment: { value: string; errors: string[] };
    elapsedSeconds: { value: number; errors: string[] };
    multiplier: { value: number; errors: string[] };
    key: string;
  }>;
};

const useUpdateWorkoutWithExercisesForm = ({
  workoutWithExercises,
}: {
  workoutWithExercises: NonNullable<
    NonNullable<FuzzySearchQuery["pastWorkouts"]>["workoutWithExercises"]
  >[0];
}) => {
  const { comment, date, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};

  const [state, setState] = useState<UpdateWorkoutState>({
    date: { value: date ?? "", errors: [] },
    comment: { value: comment ?? "", errors: [] },
    elapsedSeconds: { value: elapsedSeconds ?? 0, errors: [] },
    exercises: (exercises ?? [])?.map((exercise) => {
      return {
        uid: exercise.uid ?? "",
        title: { value: exercise?.title ?? "", errors: [] },
        weight: { value: exercise.weight?.toString() ?? "", errors: [] },
        weightUnit: { value: exercise.weightUnit ?? "", errors: [] },
        sets: { value: exercise.sets?.toString() ?? "", errors: [] },
        reps: { value: exercise.reps?.toString() ?? "", errors: [] },
        repsDisplay: { value: exercise.repsDisplay ?? "", errors: [] },
        comment: { value: exercise.comment ?? "", errors: [] },
        elapsedSeconds: { value: exercise.elapsedSeconds ?? 0, errors: [] },
        multiplier: { value: exercise.multiplier ?? 1, errors: [] },
        key: `key-${Date.now()}-${Math.random().toString(36)}`,
      };
    }),
  });

  const formHasErrors = () =>
    state.date.errors.length > 0 ||
    state.comment.errors.length > 0 ||
    state.elapsedSeconds.errors.length > 0 ||
    state.exercises.some((t) =>
      [
        t.title,
        t.weight,
        t.weightUnit,
        t.sets,
        t.reps,
        t.repsDisplay,
        t.comment,
        t.elapsedSeconds,
        t.multiplier,
      ].some((f) => f.errors.length > 0)
    );

  function validateState(state: UpdateWorkoutState): ValidationResult {
    const result: ValidationResult = {
      root: {
        date: [],
        comment: [],
        elapsedSeconds: [],
      },
      exercises: state.exercises.map(() => ({
        title: [],
        weight: [],
        weightUnit: [],
        sets: [],
        reps: [],
        repsDisplay: [],
        comment: [],
        elapsedSeconds: [],
        multiplier: [],
      })),
    };

    // Workout-level validations
    if (!state.date.value) {
      result.root.date.push(WorkoutErrorsMessages.date);
    }
    if (state.comment.value.length > 512) {
      result.root.comment.push(WorkoutErrorsMessages.comment);
    }

    // Exercise-level validations
    state.exercises.forEach((e, i) => {
      if (!e.title.value.trim()) {
        result.exercises[i].title.push(ExerciseErrorsMessages.title);
      }
      if (!!e.weight.value === false && !!e.weightUnit.value === true) {
        result.exercises[i].weight.push(ExerciseErrorsMessages.weight);
      }
      if (!!e.weight.value === true && !!e.weightUnit.value === false) {
        result.exercises[i].weightUnit.push(ExerciseErrorsMessages.weightUnit);
      }
      if (
        (!!e.reps.value === true || !!e.repsDisplay.value === true) &&
        !!e.sets.value === false
      ) {
        result.exercises[i].sets.push(ExerciseErrorsMessages.sets);
      }
      if (
        (!!e.sets.value === true || !!e.repsDisplay.value === true) &&
        !!e.reps.value === false
      ) {
        result.exercises[i].reps.push(ExerciseErrorsMessages.reps);
      }
      if (
        !!e.reps.value === true &&
        e.repsDisplay.value === "l/r" &&
        Number(e.reps.value) % 2 !== 0
      ) {
        result.exercises[i].reps.push(ExerciseErrorsMessages.repsLrEven);
      }
      if (
        (!!e.reps.value === true || !!e.sets.value === true) &&
        !!e.repsDisplay.value === false
      ) {
        result.exercises[i].repsDisplay.push(
          ExerciseErrorsMessages.repsDisplay
        );
      }
      if (
        Number.isNaN(Number(e.multiplier.value)) ||
        Number(e.multiplier.value) < 0 ||
        Number(e.multiplier.value) > 100
      ) {
        result.exercises[i].multiplier.push(ExerciseErrorsMessages.multiplier);
      }
      if (
        !!e.reps.value === true &&
        e.repsDisplay.value === "(1,2)" &&
        Number(e.reps.value) !== 6
      ) {
        result.exercises[i].reps.push(ExerciseErrorsMessages.oneTwoLadder);
      }
      if (
        !!e.reps.value === true &&
        e.repsDisplay.value === "(1,2,3)" &&
        Number(e.reps.value) !== 12
      ) {
        result.exercises[i].reps.push(ExerciseErrorsMessages.oneThreeLadder);
      }
      if (
        !!e.reps.value === true &&
        e.repsDisplay.value === "(1,2,3,4)" &&
        Number(e.reps.value) !== 20
      ) {
        result.exercises[i].reps.push(ExerciseErrorsMessages.oneFourLadder);
      }
      if (
        !!e.reps.value === true &&
        e.repsDisplay.value === "(1,2,3,4,5)" &&
        Number(e.reps.value) !== 30
      ) {
        result.exercises[i].reps.push(ExerciseErrorsMessages.oneFiveLadder);
      }
      if (e.comment.value.length > 512) {
        result.exercises[i].comment.push(ExerciseErrorsMessages.comment);
      }
    });
    return result;
  }

  function updateState(
    producer: (prev: UpdateWorkoutState) => UpdateWorkoutState
  ) {
    setState((prev) => {
      const next = producer(prev);
      const validation = validateState(next);

      return {
        ...next,
        date: {
          ...next.date,
          errors: validation.root.date,
        },
        comment: {
          ...next.comment,
          errors: validation.root.comment,
        },
        elapsedSeconds: {
          ...next.elapsedSeconds,
          errors: validation.root.elapsedSeconds,
        },
        exercises: next.exercises.map((e, i) => ({
          ...e,
          title: {
            ...e.title,
            errors: validation.exercises[i].title,
          },
          weight: {
            ...e.weight,
            errors: validation.exercises[i].weight,
          },
          weightUnit: {
            ...e.weightUnit,
            errors: validation.exercises[i].weightUnit,
          },
          sets: {
            ...e.sets,
            errors: validation.exercises[i].sets,
          },
          reps: {
            ...e.reps,
            errors: validation.exercises[i].reps,
          },
          repsDisplay: {
            ...e.repsDisplay,
            errors: validation.exercises[i].repsDisplay,
          },
          comment: {
            ...e.comment,
            errors: validation.exercises[i].comment,
          },
          elapsedSeconds: {
            ...e.elapsedSeconds,
            errors: validation.exercises[i].elapsedSeconds,
          },
          multiplier: {
            ...e.multiplier,
            errors: validation.exercises[i].multiplier,
          },
        })),
      };
    });
  }

  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    updateState((prevState) => ({
      ...prevState,
      [name]: { value: value, errors: [] },
    }));
  }

  const setTime = (elapsedSeconds: number) => {
    updateState((prevState) => ({
      ...prevState,
      elapsedSeconds: {
        value: elapsedSeconds,
        errors: prevState.elapsedSeconds.errors,
      },
    }));
  };

  const setComment = (newComment: string) => {
    updateState((prevState) => ({
      ...prevState,
      comment: { value: newComment, errors: prevState.comment.errors },
    }));
  };

  function deleteExercise(index: number): void {
    updateState((prevState) => ({
      ...prevState,
      exercises: prevState?.exercises?.filter((_, i) => i !== index),
    }));
  }

  type ExerciseField =
    | "title"
    | "weight"
    | "weightUnit"
    | "sets"
    | "reps"
    | "repsDisplay"
    | "comment"
    | "elapsedSeconds"
    | "multiplier";
  function handleExercise(
    name: string,
    value: string | number,
    index: number
  ): void {
    updateState((prevState) => ({
      ...prevState,
      exercises: prevState?.exercises?.map((exercise, i) => {
        if (i === index) {
          return {
            ...exercise,
            [name]: { ...exercise[name as ExerciseField], value: value },
          };
        }
        return exercise;
      }),
    }));
  }

  return {
    state,
    handleStateChange,
    setTime,
    setComment,
    deleteExercise,
    handleExercise,
    formHasErrors,
  };
};

export default useUpdateWorkoutWithExercisesForm;
