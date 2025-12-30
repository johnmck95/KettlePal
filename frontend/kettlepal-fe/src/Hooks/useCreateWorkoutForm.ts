import { ChangeEvent, useEffect, useRef, useState } from "react";
import { calculateElapsedTime, getCurrentDate } from "../utils/Time/time";
import { useAddWorkoutWithExercisesMutation } from "../generated/frontend-types";
import { useUser } from "../Contexts/UserContext";
import { useDisclosure } from "@chakra-ui/react";
import { StopwatchRef } from "../Components/NewWorkouts/FormComponents/NewWorkout/Generic/Stopwatch";

export const SESSION_STATE_KEY = "createWorkoutState";
export const STOPWATCH_IS_ACTIVE_KEY = "stopwatchIsActive";
export const SHOW_TRACKING_KEY = "showTracking";
export const WORKOUT_STATE_KEY = "workoutState";
export const STOPWATCH_TIMESTAMP_KEY = "stopwatchStartTimeStamp";

export type ExerciseErrors = {
  title: string[];
  weight: string[];
  weightUnit: string[];
  sets: string[];
  reps: string[];
  repsDisplay: string[];
  comment: string[];
  elapsedSeconds: string[];
  multiplier: string[];
};

export type ValidationResult = {
  root: {
    date: string[];
    comment: string[];
    elapsedSeconds: string[];
  };
  exercises: ExerciseErrors[];
};

export enum WorkoutErrorsMessages {
  date = "Please enter a workout date.",
  timer = "Please stop the workout timer before saving.",
  comment = "Comment cannot exceed 512 characters.",
}
export enum ExerciseErrorsMessages {
  title = "Title is required.",
  weight = "Weight is required when Weight Unit is provided.",
  weightUnit = "Weight Unit is required when Weight is proivided.",
  sets = "Sets are required when Reps or Rep Type are provided.",
  reps = "Reps are required when Sets or Rep Type are provided.",
  repsLrEven = "Reps must be an even number when Type is 'Left / Right'.",
  repsDisplay = "Rep Type is required when Sets or Reps are provided.",
  multiplier = "Multiplier must be a realistic, positive number.",
  oneTwoLadder = "Reps must be 6 when Type is '(1,2)'.",
  oneThreeLadder = "Reps must be 12 when Type is '(1,2,3)'.",
  oneFourLadder = "Reps must be 20 when Type is '(1,2,3,4)'.",
  oneFiveLadder = "Reps must be 30 when Type is '(1,2,3,4,5)'.",
  comment = "Comment cannot exceed 512 characters.",
}

export type CreateWorkoutState = {
  date: { value: string; errors: string[] };
  comment: { value: string; errors: string[] };
  elapsedSeconds: { value: number; errors: string[] };
  exercises: Array<{
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

const useCreateWorkoutForm = () => {
  const [state, setState] = useState<CreateWorkoutState>(() => {
    const fromStorage = sessionStorage.getItem(SESSION_STATE_KEY);
    return fromStorage
      ? JSON.parse(fromStorage)
      : {
          date: { value: getCurrentDate(), errors: [] },
          comment: { value: "", errors: [] },
          elapsedSeconds: { value: 0, errors: [] },
          exercises: [],
        };
  });
  const [showTracking, setShowTracking] = useState<boolean>(() => {
    const fromStorage = sessionStorage.getItem(SHOW_TRACKING_KEY);
    return fromStorage ? JSON.parse(fromStorage) : false;
  });
  const [addComments, setAddComments] = useState<boolean>(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState<boolean>(false);
  const userUid = useUser().user?.uid ?? null;

  const [timerIsActive, setTimerIsActive] = useState(() => {
    const fromStorage = sessionStorage.getItem(STOPWATCH_IS_ACTIVE_KEY);
    return fromStorage ? true : false;
  });

  const [submitted, setSubmitted] = useState(false);
  const [showServerError, setShowServerError] = useState<boolean>(true);
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

  function validateState(state: CreateWorkoutState): ValidationResult {
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
    if (timerIsActive) {
      result.root.elapsedSeconds.push(WorkoutErrorsMessages.timer);
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
    producer: (prev: CreateWorkoutState) => CreateWorkoutState
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

  // The StopWatch ref to control start/pause from CreateWorkout.tsx
  const ref = useRef<StopwatchRef>(null);

  const [workoutState, setWorkoutState] = useState<
    "initial" | "active" | "submit"
  >(() => {
    const fromStorage = sessionStorage.getItem(WORKOUT_STATE_KEY);
    return fromStorage ? JSON.parse(fromStorage) : "initial";
  });

  const handleWorkoutState = (val: "initial" | "active" | "submit") => {
    setWorkoutState(val);
    sessionStorage.setItem(WORKOUT_STATE_KEY, JSON.stringify(val));
  };

  // Toggles the Create Workout Stopwatch when Start/Pause is clicked
  function startOrPause() {
    setShowTracking((prev) => !prev);
    sessionStorage.setItem(SHOW_TRACKING_KEY, JSON.stringify(!showTracking));
    if (showTracking) {
      ref.current?.stop();
    } else {
      ref.current?.startOrResume();
    }
    const clockStarted = parseInt(
      sessionStorage.getItem(STOPWATCH_TIMESTAMP_KEY) ?? "",
      10
    );
    if (!!clockStarted && state.exercises.length > 0) {
      handleWorkoutState(showTracking ? "submit" : "active");
    } else {
      handleWorkoutState("initial");
    }
  }

  const handleTimerIsActive = (newState: boolean) => {
    setTimerIsActive(newState);
    if (newState) {
      sessionStorage.setItem(STOPWATCH_IS_ACTIVE_KEY, "true");
    } else {
      sessionStorage.removeItem(STOPWATCH_IS_ACTIVE_KEY);
    }
  };

  // Mutation to submit workoutWithExercises to DB
  const [addWorkoutWithExercises, { loading, error }] =
    useAddWorkoutWithExercisesMutation({
      onCompleted() {
        setState({
          date: { value: getCurrentDate(), errors: [] },
          comment: { value: "", errors: [] },
          elapsedSeconds: { value: 0, errors: [] },
          exercises: [],
        });
        handleWorkoutState("initial");
        sessionStorage.removeItem(SESSION_STATE_KEY);
        setShowUploadSuccess(true);
        setTimeout(() => {
          setShowUploadSuccess(false);
        }, 5000);
      },
      onError() {
        setShowServerError(true);
      },
    });

  // Save state to session storage
  useEffect(() => {
    sessionStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Update workout timer every 1s
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (timerIsActive) {
      interval = setInterval(() => {
        const storedTimestamp = parseInt(
          sessionStorage.getItem(STOPWATCH_TIMESTAMP_KEY) ?? "",
          10
        );
        setTime(calculateElapsedTime(storedTimestamp));
      }, 1000);
    } else if (!timerIsActive && state.elapsedSeconds.value !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, state.elapsedSeconds]);

  // Updates workout timer. HTML lacks name property.
  const setTime = (elapsedSeconds: number) => {
    updateState((prevState: CreateWorkoutState) => ({
      ...prevState,
      elapsedSeconds: {
        value: elapsedSeconds,
        errors: prevState.elapsedSeconds.errors,
      },
    }));
  };

  // Updates workout comment. HTML lacks name property.
  const setComment = (newComment: string) => {
    updateState((prevState: CreateWorkoutState) => ({
      ...prevState,
      comment: { value: newComment, errors: prevState.comment.errors },
    }));
  };

  // Updates remaining workout state properties
  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    updateState((prevState) => ({
      ...prevState,
      [name]: { value: value, errors: [] },
    }));

    // If you change the date with no exercises, reset workout tracking (stale browser tab).
    if (name === "date" && state.exercises.length === 0) {
      deleteExerciseTrackingFromSessionStorage();
    }
  }

  // Initialize a new exercise object
  function handleAddExercise(): void {
    updateState((prevState) => ({
      ...prevState,
      exercises: [
        {
          title: { value: "", errors: [] },
          weight: { value: "", errors: [] },
          weightUnit: { value: "", errors: [] },
          sets: { value: "", errors: [] },
          reps: { value: "", errors: [] },
          repsDisplay: { value: "", errors: [] },
          comment: { value: "", errors: [] },
          elapsedSeconds: { value: 0, errors: [] },
          multiplier: { value: 1.0, errors: [] },
          key: `key-${Date.now()}-${Math.random().toString(36)}`,
        },
        ...prevState.exercises,
      ],
    }));
  }

  // Deletes an exercise object from state
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
  // Updates all per-exercise state properties based on the index.
  function handleExercise(
    name: string,
    value: string | number,
    index: number
  ): void {
    updateState((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.map((exercise, i) => {
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

  /**
   * Deletes all 'completedSets-#' key-val pairs from sessionStorage, used for traacking a workout.
   */
  function deleteExerciseTrackingFromSessionStorage(): void {
    const PREFIX = "completedSets-";

    for (let i = 0; i < sessionStorage.length - 1; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        sessionStorage.removeItem(key);
      }
    }
  }

  // Show client-side errors, if clear, try to post to DB
  // apollo onError will handle rendering server-side errors
  async function onSaveWorkout(): Promise<void> {
    setSubmitted(true);
    onCloseSaveWorkout();
    if (formHasErrors()) {
      return;
    }
    try {
      await addWorkoutWithExercises({
        variables: {
          userUid: userUid ?? "",
          workoutWithExercises: {
            ...state,
            date: state.date.value,
            comment: state.comment.value,
            elapsedSeconds: state.elapsedSeconds.value,
            exercises: state.exercises.map((e) => ({
              title: e.title.value,
              weight: e.weight.value,
              weightUnit: e.weightUnit.value,
              sets: e.sets.value,
              reps: e.reps.value,
              repsDisplay: e.repsDisplay.value,
              comment: e.comment.value,
              elapsedSeconds: e.elapsedSeconds.value,
              multiplier: e.multiplier.value,
              key: e.key,
            })),
          },
        },
      });
      deleteExerciseTrackingFromSessionStorage();
    } catch (err) {
      console.error("Error submitting workout with exercises: ", err);
    }
  }

  // Stop showing client-side errors when all exercises are deleted.
  useEffect(() => {
    if (state.exercises.length === 0) {
      setSubmitted(false);
    }
  }, [state.exercises.length]);

  // Save Workout Modal Controls
  const {
    isOpen: isOpenSaveWorkout,
    onOpen: onOpenSaveWorkout,
    onClose: onCloseSaveWorkout,
  } = useDisclosure();

  return {
    state,
    loading,
    error,
    showTracking,
    addComments,
    showUploadSuccess,
    submitted,
    showServerError,
    timerIsActive,
    isOpenSaveWorkout,
    workoutState,
    ref,
    setTime,
    setComment,
    setShowServerError,
    setAddComments,
    handleTimerIsActive,
    handleStateChange,
    handleAddExercise,
    handleExercise,
    deleteExercise,
    onOpenSaveWorkout,
    onCloseSaveWorkout,
    onSaveWorkout,
    startOrPause,
  };
};

export default useCreateWorkoutForm;
