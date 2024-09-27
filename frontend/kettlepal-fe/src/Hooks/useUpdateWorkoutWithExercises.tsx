import { ChangeEvent, useEffect, useState } from "react";
import { formatDateForYYYYMMDD, postgresToDayJs } from "../utils/Time/time";
import { UserWithWorkoutsQuery } from "../generated/frontend-types";
import { CreateWorkoutState } from "../Components/NewWorkouts/CreateWorkout";

const useUpdateWorkoutWithExercises = ({
  workoutWithExercises,
}: {
  workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0];
}) => {
  const { comment, createdAt, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};
  const [formHasErrors, setFormHasErrors] = useState(false);

  const [state, setState] = useState<CreateWorkoutState>({
    createdAt: formatDateForYYYYMMDD(postgresToDayJs(createdAt ?? "")) ?? "",
    comment: comment ?? "",
    elapsedSeconds: elapsedSeconds ?? 0,
    exercises: (exercises ?? [])?.map((exercise) => {
      return {
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
  const dateIsInvalid = !state.createdAt;
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

export default useUpdateWorkoutWithExercises;
