import { useEffect, useState } from "react";
import { CreateWorkoutState } from "./useCreateWorkoutForm";
import { useDisclosure } from "@chakra-ui/react";
import getConfigurations, {
  KettlbellWeightsKG,
} from "../Constants/ExercisesOptions";
import { UserInContext } from "../Contexts/UserContext";

const useCreateExerciseForm = ({
  user,
  exercise,
  exerciseIndex,
  trackingIndex,
  handleExercise,
  deleteExercise,
}: {
  user: UserInContext;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  trackingIndex: number;
}) => {
  const SESSION_STORAGE_KEY = `completedSets-${trackingIndex}`;

  // Tracking a workout
  const [completedSets, setCompletedSets] = useState<number>(() => {
    const sessionVal = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return sessionVal ? parseInt(sessionVal) : 0;
  });
  const [customTitle, setCustomTitle] = useState(
    exercise.title.value !== "" &&
      !Object.keys(
        getConfigurations(user?.templates ?? [], {
          bodyWeight: user?.bodyWeight ?? 0,
          bodyWeightUnit: user?.bodyWeightUnit ?? "kg",
        })
      ).includes(exercise.title.value)
  );
  const [customWeight, setCustomWeight] = useState(
    exercise.weight.value !== "" &&
      !KettlbellWeightsKG.includes(exercise.weight.value)
  );

  const setExerciseComment = (newComment: string) => {
    handleExercise("comment", newComment, exerciseIndex);
  };

  /**
   * Completed sets are saved in session storage by index. When an exercise is deleted,
   * ensure the session storage accurately reflects the deleted item without any holes.
   */
  function resetCompletedExercisesSessionStorage(index: number): void {
    const PREFIX = "completedSets-";

    // Collect all 'completedSets-#' key-val pairs from sessionStorage.
    const entries: { key: string; value: string }[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        const idx = Number(key.slice(PREFIX.length));
        if (!Number.isNaN(idx)) {
          entries.push({ key, value: sessionStorage.getItem(key)! });
        }
      }
    }

    // Sort by their numeric suffix to ensure correct order
    entries.sort(
      (a, b) =>
        Number(a.key.slice(PREFIX.length)) - Number(b.key.slice(PREFIX.length))
    );

    if (entries.length === 0) return;

    // Remove all 'completedSets-#' key-val pairs from sessionStorage.
    entries.forEach(({ key }) => sessionStorage.removeItem(key));

    // Re‑insert 'completedSets-#' to sessionStorage except the one we’re
    // deleting, renumbering them to stay contiguous.
    let newIndex = 0;
    for (const { key, value } of entries) {
      const oldIndex = Number(key.slice(PREFIX.length));
      if (oldIndex === index) continue; // skip the one we’re deleting
      sessionStorage.setItem(`${PREFIX}${newIndex}`, value);
      newIndex++;
    }
  }

  // Removes exercise from state and handles swipe logic for mobile
  function onDeleteExercise(): void {
    resetCompletedExercisesSessionStorage(trackingIndex);
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

  // Keep track of completed sets in session storage
  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, completedSets.toString());
  }, [completedSets, SESSION_STORAGE_KEY]);

  // In workout tracking. Bump total sets if you've tracked more than state.exercise[indx].sets
  function completedASet() {
    setCompletedSets((prev) => prev + 1);
    if (exercise.sets.value === "") {
      handleExercise("sets", "1", exerciseIndex);
    } else if (completedSets >= parseInt(exercise.sets.value)) {
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
    if (completedSets > parseInt(exercise.sets.value)) {
      setCompletedSets(parseInt(exercise.sets.value));
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
    isOpenDeleteExercise,
    minSwipeDistance,
    offset,
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
