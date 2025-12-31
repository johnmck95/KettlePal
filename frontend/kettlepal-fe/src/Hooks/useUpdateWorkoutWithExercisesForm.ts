import { ChangeEvent, useState } from "react";
import { FuzzySearchQuery } from "../generated/frontend-types";
import {
  CreateOrUpdateWorkoutState,
  validateState,
} from "./HookHelpers/validation";

const useUpdateWorkoutWithExercisesForm = ({
  workoutWithExercises,
}: {
  workoutWithExercises: NonNullable<
    NonNullable<FuzzySearchQuery["pastWorkouts"]>["workoutWithExercises"]
  >[0];
}) => {
  const { comment, date, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};

  const [state, setState] = useState<CreateOrUpdateWorkoutState>({
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

  function updateState(
    producer: (prev: CreateOrUpdateWorkoutState) => CreateOrUpdateWorkoutState
  ) {
    setState((prev) => {
      const next = producer(prev);
      const validation = validateState(next, false);

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
