import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import getConfigurations, {
  KettlbellWeightsKG,
} from "../Constants/ExercisesOptions";
import { UserInContext } from "../Contexts/UserContext";
import { CreateOrUpdateWorkoutState } from "./HookHelpers/validation";

const useCreateExerciseForm = ({
  user,
  exercise,
  exerciseKey,
  exerciseIndex,
  handleExercise,
  deleteExercise,
  resetCompletedExercisesSessionStorage,
}: {
  user: UserInContext;
  exercise: Omit<CreateOrUpdateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  exerciseKey: string;
  resetCompletedExercisesSessionStorage?: (exerciseKey: string) => void;
}) => {
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

  // Removes exercise from state and handles swipe logic for mobile
  function onDeleteExercise(): void {
    resetCompletedExercisesSessionStorage?.(exerciseKey);
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
    customTitle,
    customWeight,
    isOpenDeleteExercise,
    minSwipeDistance,
    offset,
    customOnCloseDeleteExercise,
    onDeleteExercise,
    onOpenDeleteExercise,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    setCustomTitle,
    setCustomWeight,
    setExerciseComment,
    setOffset,
    swipeDistance,
  };
};

export default useCreateExerciseForm;
