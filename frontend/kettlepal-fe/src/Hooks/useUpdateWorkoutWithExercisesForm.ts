import { ChangeEvent, useEffect, useState } from "react";
import { FuzzySearchQuery } from "../generated/frontend-types";

export type UpdateWorkoutState = {
  date: string;
  comment: string;
  elapsedSeconds: number;
  exercises: Array<{
    uid: string;
    title: string;
    weight: string;
    weightUnit: string;
    sets: string;
    reps: string;
    repsDisplay: string;
    comment: string;
    elapsedSeconds: number;
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
  const [formHasErrors, setFormHasErrors] = useState(false);

  const [state, setState] = useState<UpdateWorkoutState>({
    date: date ?? "",
    comment: comment ?? "",
    elapsedSeconds: elapsedSeconds ?? 0,
    exercises: (exercises ?? [])?.map((exercise) => {
      return {
        uid: exercise.uid ?? "",
        title: exercise?.title ?? "",
        weight: exercise.weight?.toString() ?? "",
        weightUnit: exercise.weightUnit ?? "",
        sets: exercise.sets?.toString() ?? "",
        reps: exercise.reps?.toString() ?? "",
        repsDisplay: exercise.repsDisplay ?? "",
        comment: exercise.comment ?? "",
        elapsedSeconds: exercise.elapsedSeconds ?? 0,
        key: `key-${Date.now()}-${Math.random().toString(36)}`,
      };
    }),
  });

  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const setTime = (elapsedSeconds: number) => {
    setState((prevState) => ({
      ...prevState,
      elapsedSeconds,
    }));
  };

  const setComment = (newComment: string) => {
    setState((prevState) => ({
      ...prevState,
      comment: newComment,
    }));
  };

  function deleteExercise(index: number): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState?.exercises?.filter((_, i) => i !== index),
    }));
  }

  function handleExercise(
    name: string,
    value: string | number,
    index: number
  ): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState?.exercises?.map((exercise, i) => {
        if (i === index) {
          return {
            ...exercise,
            [name]: value,
          };
        }
        return exercise;
      }),
    }));
  }

  // Workout Validation
  const dateIsInvalid = !state.date;
  enum WorkoutErrors {
    date = "Please enter a workout date.",
  }
  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (dateIsInvalid) errors.push(WorkoutErrors.date);

  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  return {
    state,
    formHasErrors,
    handleStateChange,
    setTime,
    setComment,
    deleteExercise,
    handleExercise,
    setFormHasErrors,
  };
};

export default useUpdateWorkoutWithExercisesForm;
