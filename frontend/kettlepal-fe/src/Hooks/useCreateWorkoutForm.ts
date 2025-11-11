import { ChangeEvent, useEffect, useRef, useState } from "react";
import { calculateElapsedTime, getCurrentDate } from "../utils/Time/time";
import { useAddWorkoutWithExercisesMutation } from "../generated/frontend-types";
import { useUser } from "../Contexts/UserContext";
import { useDisclosure } from "@chakra-ui/react";
import { StopwatchRef } from "../Components/NewWorkouts/FormComponents.tsx/Generic/Stopwatch";

const SESSION_STATE_KEY = "createWorkoutState";
const STOPWATCH_IS_ACTIVE_KEY = "stopwatchIsActive";
export const STOPWATCH_TIMESTAMP_KEY = "stopwatchStartTimeStamp";

export type CreateWorkoutState = {
  date: string;
  comment: string;
  elapsedSeconds: number;
  exercises: Array<{
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

const useCreateWorkoutForm = () => {
  const [state, setState] = useState<CreateWorkoutState>(() => {
    const fromStorage = sessionStorage.getItem(SESSION_STATE_KEY);
    return fromStorage
      ? JSON.parse(fromStorage)
      : {
          date: getCurrentDate(),
          comment: "",
          elapsedSeconds: 0,
          exercises: [],
        };
  });
  const [showTracking, setShowTracking] = useState<boolean>(false);
  const [addComments, setAddComments] = useState<boolean>(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);
  const [formHasErrors, setFormHasErrors] = useState(false);
  const [showServerError, setShowServerError] = useState<boolean>(true);
  const userUid = useUser().user?.uid ?? null;

  const [timerIsActive, setTimerIsActive] = useState(() => {
    const fromStorage = sessionStorage.getItem(STOPWATCH_IS_ACTIVE_KEY);
    return fromStorage ? true : false;
  });

  // The StopWatch ref to control start/pause from CreateWorkout.tsx
  const ref = useRef<StopwatchRef>(null);

  const [workoutState, setWorkoutState] = useState<
    "initial" | "active" | "submit"
  >("initial");

  // Toggles the Create Workout Stopwatch when Start/Pause is clicked
  function startOrPause() {
    setShowTracking((prev) => !prev);
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
      setWorkoutState(showTracking ? "submit" : "active");
    } else {
      setWorkoutState("initial");
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
          date: getCurrentDate(),
          comment: "",
          elapsedSeconds: 0,
          exercises: [],
        });
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
    } else if (!timerIsActive && state.elapsedSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, state.elapsedSeconds]);

  // Updates workout timer. HTML lacks name property.
  const setTime = (elapsedSeconds: number) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      elapsedSeconds,
    }));
  };

  // Updates workout comment. HTML lacks name property.
  const setComment = (newComment: string) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      comment: newComment,
    }));
  };

  // Updates remaining workout state properties
  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // If you change the date with no exercises, reset workout tracking (stale browser tab).
    if (name === "date" && state.exercises.length === 0) {
      deleteExerciseTrackingFromSessionStorage();
    }
  }

  // Initialize a new exercise object
  function handleAddExercise(): void {
    setState((prevState) => ({
      ...prevState,
      exercises: [
        {
          title: "",
          weight: "",
          weightUnit: "",
          sets: "",
          reps: "",
          repsDisplay: "",
          comment: "",
          elapsedSeconds: 0,
          key: `key-${Date.now()}-${Math.random().toString(36)}`,
        },
        ...prevState.exercises,
      ],
    }));
  }

  // Deletes an exercise object from state
  function deleteExercise(index: number): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState?.exercises?.filter((_, i) => i !== index),
    }));
  }

  // Updates all per-exercise state properties based on the index.
  function handleExercise(
    name: string,
    value: string | number,
    index: number
  ): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.map((exercise, i) => {
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

  // Workout Validation (Exercise Validation is handled in child component)
  enum WorkoutErrors {
    date = "Please enter a workout date.",
    timer = "Please stop the workout timer before saving.",
  }
  const dateIsInvalid = !state.date;
  const timerIsInvalid = timerIsActive;
  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (dateIsInvalid) errors.push(WorkoutErrors.date);
  // NOW THAT START/PAUSE/FINISH CONTROL AHNDLES STOPWATCH, THIS ERROR SHOULD NOT BE POSSIBLE.
  // if (timerIsInvalid) errors.push(WorkoutErrors.timer);
  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  // Client-side error handling
  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

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
    setWorkoutState("initial");
    if (dateIsInvalid || timerIsInvalid) {
      setFormHasErrors(true);
      return;
    }
    if (formHasErrors) {
      return;
    }
    try {
      await addWorkoutWithExercises({
        variables: {
          userUid: userUid ?? "",
          workoutWithExercises: state,
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
    errors,
    showServerError,
    timerIsActive,
    isOpenSaveWorkout,
    workoutState,
    ref,
    setTime,
    setComment,
    setFormHasErrors,
    setShowServerError,
    setAddComments,
    setShowTracking,
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
