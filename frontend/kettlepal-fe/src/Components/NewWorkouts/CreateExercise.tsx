import React from "react";

import {
  Button,
  GridItem,
  SimpleGrid,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import AddComment from "./FormComponents/NewWorkout/Generic/AddComment";
import ConfirmModal from "../ConfirmModal";
import ExerciseTitle from "./FormComponents/NewWorkout/Exercise/ExerciseTitle";
import ExerciseWeight from "./FormComponents/NewWorkout/Exercise/ExerciseWeight";
import ExerciseSets from "./FormComponents/NewWorkout/Exercise/ExerciseSets";
import ExerciseReps from "./FormComponents/NewWorkout/Exercise/ExerciseReps";
import ExerciseRepsDisplay from "./FormComponents/NewWorkout/Exercise/ExerciseRepsDisplay";
import ExerciseWeightUnit from "./FormComponents/NewWorkout/Exercise/ExerciseWeightUnit";
import TrackExercise from "./FormComponents/NewWorkout/MidWorkoutTracking/TrackExercise";
import { ExerciseContainer } from "./FormComponents/NewWorkout/Exercise/ExerciseContainer";
import useCreateExerciseForm from "../../Hooks/useCreateExerciseForm";
import "../../Styles/CustomSelect.css";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import theme from "../../Constants/theme";
import { useUser } from "../../Contexts/UserContext";
import { CreateOrUpdateWorkoutState } from "../../Hooks/HookHelpers/validation";

interface CreateExerciseProps {
  exercise: CreateOrUpdateWorkoutState["exercises"][number];
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  submitted: boolean;
  trackWorkout: boolean;
  showComments: boolean;
  addExerciseVariant?: () => void;
  flat?: boolean;
  hideSharedFields?: boolean;
  stripColor?: string;
  forceMobileStyle?: boolean;
  forceCloseButton?: boolean;
  completedSets?: number;
  completedASet?: () => void;
  removedASet?: () => void;
  resetCompletedExercisesSessionStorage?: (exerciseKey: string) => void;
}

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  submitted,
  trackWorkout,
  showComments,
  addExerciseVariant,
  flat = false,
  hideSharedFields = false,
  stripColor,
  forceMobileStyle = false,
  forceCloseButton = false,
  completedSets,
  completedASet,
  removedASet,
  resetCompletedExercisesSessionStorage,
}: CreateExerciseProps) {
  const user = useUser().user;
  const {
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
  } = useCreateExerciseForm({
    user,
    exercise,
    exerciseIndex,
    exerciseKey: exercise.key,
    handleExercise,
    deleteExercise,
    resetCompletedExercisesSessionStorage,
  });

  const errors = [
    ...exercise.title.errors,
    ...exercise.weight.errors,
    ...exercise.weightUnit.errors,
    ...exercise.sets.errors,
    ...exercise.reps.errors,
    ...exercise.repsDisplay.errors,
    ...exercise.comment.errors,
    ...exercise.elapsedSeconds.errors,
    ...exercise.multiplier.errors,
  ];
  const [isMobile] = useMediaQuery("(max-width: 430px)");

  return (
    <ExerciseContainer
      errors={errors}
      submitted={submitted}
      offset={offset}
      setOffset={setOffset}
      minSwipeDistance={minSwipeDistance}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      swipeDistance={swipeDistance}
      onOpenDeleteExercise={onOpenDeleteExercise}
      forceMobileStyle={forceMobileStyle}
      forceCloseButton={forceCloseButton}
      flat={flat}
      stripColor={stripColor}
    >
      {trackWorkout ? (
        <Text
          w="100%"
          color={theme.colors.grey[600]}
          minH={isMobile ? "0" : "1.25rem"}
        >
          <i>
            {formatExerciseString({
              title: exercise.title.value,
              weight: exercise.weight.value,
              weightUnit: exercise.weightUnit.value,
              sets: exercise.sets.value,
              reps: exercise.reps.value,
              repsDisplay: exercise.repsDisplay.value,
              comment: exercise.comment.value,
            }) || "----"}
          </i>
        </Text>
      ) : (
        <>
          {isMobile ? (
            <>
              {!hideSharedFields && (
                <SimpleGrid
                  gap={1}
                  templateColumns="2fr 1fr"
                  w="100%"
                  mb="0.5rem"
                  sx={{ "& > *": { minWidth: 0 } }}
                >
                  <ExerciseTitle
                    titleIsInvalid={submitted && exercise.title.errors.length > 0}
                    customTitle={customTitle}
                    exercise={exercise}
                    exerciseIndex={exerciseIndex}
                    setCustomTitle={setCustomTitle}
                    handleExercise={handleExercise}
                  />
                  <ExerciseRepsDisplay
                    repsDisplayIsInvalid={
                      submitted && exercise.repsDisplay.errors.length > 0
                    }
                    exercise={exercise}
                    exerciseIndex={exerciseIndex}
                    handleExercise={handleExercise}
                  />
                </SimpleGrid>
              )}
              <SimpleGrid
                gap={1}
                templateColumns="20% 20% 30% 30%"                w="100%"
                sx={{ "& > *": { minWidth: 0 } }}
              >
                <ExerciseSets
                  setsIsInvalid={submitted && exercise.sets.errors.length > 0}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  handleExercise={handleExercise}
                />
                <ExerciseReps
                  repsIsInvalid={submitted && exercise.reps.errors.length > 0}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  handleExercise={handleExercise}
                />
                <ExerciseWeight
                  weightIsInvalid={submitted && exercise.weight.errors.length > 0}
                  customWeight={customWeight}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  setCustomWeight={setCustomWeight}
                  handleExercise={handleExercise}
                />
                <ExerciseWeightUnit
                  weightUnitIsInvalid={
                    submitted && exercise.weightUnit.errors.length > 0
                  }
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  handleExercise={handleExercise}
                />
              </SimpleGrid>
            </>
          ) : (
            <SimpleGrid
              gap={1}
              templateColumns={
                hideSharedFields
                  ? "1fr 1fr 1.5fr 1.3fr"
                  : "2.4fr 1.6fr 0.9fr 0.9fr 1.4fr 1.2fr"
              }
              w="100%"
              sx={{ "& > *": { minWidth: 0 } }}
            >
              {!hideSharedFields && (
                <>
                  <ExerciseTitle
                    titleIsInvalid={submitted && exercise.title.errors.length > 0}
                    customTitle={customTitle}
                    exercise={exercise}
                    exerciseIndex={exerciseIndex}
                    setCustomTitle={setCustomTitle}
                    handleExercise={handleExercise}
                  />
                  <ExerciseRepsDisplay
                    repsDisplayIsInvalid={
                      submitted && exercise.repsDisplay.errors.length > 0
                    }
                    exercise={exercise}
                    exerciseIndex={exerciseIndex}
                    handleExercise={handleExercise}
                  />
                </>
              )}
              <ExerciseSets
                setsIsInvalid={submitted && exercise.sets.errors.length > 0}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
              <ExerciseReps
                repsIsInvalid={submitted && exercise.reps.errors.length > 0}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
              <ExerciseWeight
                weightIsInvalid={submitted && exercise.weight.errors.length > 0}
                customWeight={customWeight}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                setCustomWeight={setCustomWeight}
                handleExercise={handleExercise}
              />
              <ExerciseWeightUnit
                weightUnitIsInvalid={
                  submitted && exercise.weightUnit.errors.length > 0
                }
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </SimpleGrid>
          )}

          {/* EXERCISE COMMENT */}
          {showComments && (
            <AddComment
              isInvalid={submitted && exercise.comment.errors.length > 0}
              placeholderText="Add an Exercise Comment"
              comment={exercise.comment.value}
              setComment={setExerciseComment}
              maxWidth="100%"
            />
          )}
        </>
      )}

      {/* SETS COMPLETED */}
      {trackWorkout &&
        completedSets !== undefined &&
        completedASet !== undefined &&
        removedASet !== undefined && (
          <TrackExercise
            trackWorkout={trackWorkout}
            exercise={exercise}
            completedSets={completedSets}
            removedASet={removedASet}
            completedASet={completedASet}
          />
        )}

      {/* DELETE EXERCISE MODAL */}
      <ConfirmModal
        isOpen={isOpenDeleteExercise}
        onClose={customOnCloseDeleteExercise}
        onConfirmation={onDeleteExercise}
        ModalTitle="Delete Exercise?"
        ModalBodyText="Are you sure you would like to delete this Exercise?"
        CloseText="Cancel"
        ProceedText="Delete"
        variant="warn"
      />
    </ExerciseContainer>
  );
}
