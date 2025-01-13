import { useEffect, useState } from "react";
import { CreateWorkoutState } from "./useCreateWorkoutForm";
import { useDisclosure } from "@chakra-ui/react";
import ExerciseTitles, {
  KettlbellWeightsKG,
} from "../Constants/ExercisesOptions";

const useCreateExerciseForm = ({
  exercise,
  exerciseIndex,
  handleExercise,
  deleteExercise,
  setFormHasErrors,
}: {
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  setFormHasErrors: (value: boolean) => void;
}) => {
  const SESSION_STORAGE_KEY = `completedSets-${exerciseIndex}`;
  // Tracking a workout
  const [completedSets, setCompletedSets] = useState<number>(() => {
    const sessionVal = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return sessionVal ? parseInt(sessionVal) : 0;
  });
  const [customTitle, setCustomTitle] = useState(
    exercise.title !== "" && !ExerciseTitles.includes(exercise.title)
  );
  const [customWeight, setCustomWeight] = useState(
    exercise.weight !== "" && !KettlbellWeightsKG.includes(exercise.weight)
  );

  const setExerciseComment = (newComment: string) => {
    handleExercise("comment", newComment, exerciseIndex);
  };

  // Removes exercise from state and handles swipe logic for mobile
  function onDeleteExercise(): void {
    deleteExercise(exerciseIndex);
    onCloseDeleteExercise();
    setOffset(
      parseInt(
        `${
          !!swipeDistance() && swipeDistance() > minSwipeDistance
            ? swipeDistance()
            : offset
        }px`
      )
    );
  }

  // ERROR VALIDATION
  const titleIsInvalid = !exercise.title;
  const weightIsInvalid =
    !!exercise.weight === false && !!exercise.weightUnit === true;
  const weightUnitIsInvalid =
    !!exercise.weight === true && !!exercise.weightUnit === false;
  const setsIsInvalid =
    (!!exercise.reps === true || !!exercise.repsDisplay === true) &&
    !!exercise.sets === false;
  const repsIsInvalid =
    (!!exercise.sets === true || !!exercise.repsDisplay === true) &&
    !!exercise.reps === false;
  const repsDisplayIsInvalid =
    (!!exercise.reps === true || !!exercise.sets === true) &&
    !!exercise.repsDisplay === false;

  enum ExerciseErrors {
    title = "Title is required.",
    weight = "Weight is required when Weight Unit is provided.",
    weightUnit = "Weight Unit is required when Weight is proivided.",
    sets = "Sets are required when Reps or Rep Type are provided.",
    reps = "Reps are required when Sets or Rep Type are provided.",
    repsDisplay = "Rep Type is required when Sets or Reps are provided.",
  }

  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (titleIsInvalid) errors.push(ExerciseErrors.title);
  if (weightIsInvalid) errors.push(ExerciseErrors.weight);
  if (weightUnitIsInvalid) errors.push(ExerciseErrors.weightUnit);
  if (setsIsInvalid) errors.push(ExerciseErrors.sets);
  if (repsIsInvalid) errors.push(ExerciseErrors.reps);
  if (repsDisplayIsInvalid) errors.push(ExerciseErrors.repsDisplay);

  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  // Flag to detect if the form has errors.
  // Form also needs to be submitted to see the error messages.
  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  // Keep track of completed sets in session storage
  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, completedSets.toString());
  }, [completedSets, SESSION_STORAGE_KEY]);

  // In workout tracking. Bump total sets if you've tracked more than state.exercise[indx].sets
  function completedASet() {
    setCompletedSets((prev) => prev + 1);
    if (exercise.sets === "") {
      handleExercise("sets", "1", exerciseIndex);
    } else if (completedSets >= parseInt(exercise.sets)) {
      handleExercise("sets", (completedSets + 1).toString(), exerciseIndex);
    }
  }

  // Remove a tracked set, can't go below 0.
  function removedASet() {
    if (completedSets === 0) {
      return;
    }
    setCompletedSets((prev) => prev - 1);
  }

  // Bump the number of sets if your go above the plan while tracking
  useEffect(() => {
    if (completedSets > parseInt(exercise.sets)) {
      setCompletedSets(parseInt(exercise.sets));
    }
  }, [exercise.sets, completedSets, setCompletedSets]);

  // Swipe Logic
  const [offset, setOffset] = useState<number>(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const swipeDistance = () => {
    if (!touchStart || !touchEnd) {
      return 0;
    }
    return touchStart - touchEnd;
  };
  const onTouchStart = (e: any) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    const distance = swipeDistance();
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) {
      onOpenDeleteExercise();
      setOffset(distance);
    }
  };
  const customOnCloseDeleteExercise = () => {
    setOffset(0);
    onCloseDeleteExercise();
  };

  // Delete Exercise Modal Controls
  const {
    isOpen: isOpenDeleteExercise,
    onOpen: onOpenDeleteExercise,
    onClose: onCloseDeleteExercise,
  } = useDisclosure();

  return {
    completedSets,
    customTitle,
    customWeight,
    errors,
    isOpenDeleteExercise,
    minSwipeDistance,
    offset,
    repsDisplayIsInvalid,
    repsIsInvalid,
    setsIsInvalid,
    titleIsInvalid,
    weightIsInvalid,
    weightUnitIsInvalid,
    completedASet,
    customOnCloseDeleteExercise,
    onDeleteExercise,
    onOpenDeleteExercise,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    removedASet,
    setCustomTitle,
    setCustomWeight,
    setExerciseComment,
    setOffset,
    swipeDistance,
  };
};

export default useCreateExerciseForm;
