import React from "react";

import { GridItem, SimpleGrid, Text } from "@chakra-ui/react";
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
  exercise: Omit<CreateOrUpdateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  trackingIndex: number;
  submitted: boolean;
  trackWorkout: boolean;
  showComments: boolean;
  forceMobileStyle?: boolean;
  forceCloseButton?: boolean;
}

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  trackingIndex,
  submitted,
  trackWorkout,
  showComments,
  forceMobileStyle = false,
  forceCloseButton = false,
}: CreateExerciseProps) {
  const user = useUser().user;
  const {
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
  } = useCreateExerciseForm({
    user,
    exercise,
    exerciseIndex,
    trackingIndex,
    handleExercise,
    deleteExercise,
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
    >
      {trackWorkout ? (
        <Text w="100%" color={theme.colors.grey[600]}>
          <i>
            {formatExerciseString({
              title: exercise.title.value,
              weight: exercise.weight.value,
              weightUnit: exercise.weightUnit.value,
              sets: exercise.sets.value,
              reps: exercise.reps.value,
              repsDisplay: exercise.repsDisplay.value,
              comment: exercise.comment.value,
            })}
          </i>
        </Text>
      ) : (
        <>
          <SimpleGrid
            gap={1}
            templateColumns={{
              base: forceMobileStyle ? "41% 32% 24%" : "47% 27% 21%",
              lg: forceMobileStyle ? "" : "34% 8% 8% 20% 15% 12%",
            }}
            w="100%"
          >
            {/* TITLE */}
            <GridItem colSpan={1}>
              <ExerciseTitle
                titleIsInvalid={submitted && exercise.title.errors.length > 0}
                customTitle={customTitle}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                setCustomTitle={setCustomTitle}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* SETS */}
            <GridItem colSpan={1}>
              <ExerciseSets
                setsIsInvalid={submitted && exercise.sets.errors.length > 0}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* REPS */}
            <GridItem colSpan={1}>
              <ExerciseReps
                repsIsInvalid={submitted && exercise.reps.errors.length > 0}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* REPS DISPLAY */}
            <GridItem colSpan={1}>
              <ExerciseRepsDisplay
                repsDisplayIsInvalid={
                  submitted && exercise.repsDisplay.errors.length > 0
                }
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* WEIGHT */}
            <GridItem colSpan={1}>
              <ExerciseWeight
                weightIsInvalid={submitted && exercise.weight.errors.length > 0}
                customWeight={customWeight}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                setCustomWeight={setCustomWeight}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* WEIGHT UNIT */}
            <GridItem colSpan={1}>
              <ExerciseWeightUnit
                weightUnitIsInvalid={
                  submitted && exercise.weightUnit.errors.length > 0
                }
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>
            {/* </Flex> */}
          </SimpleGrid>

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
      <TrackExercise
        trackWorkout={trackWorkout}
        completedSets={completedSets}
        exercise={exercise}
        removedASet={removedASet}
        completedASet={completedASet}
      />

      {/* DELETE EXERCISE MODAL */}
      <ConfirmModal
        isOpen={isOpenDeleteExercise}
        onClose={customOnCloseDeleteExercise}
        onConfirmation={onDeleteExercise}
        ModalTitle="Delete Exercise"
        ModalBodyText="Are you sure you would like to delete this Exercise? This cannot be undone."
        CloseText="Cancel"
        ProceedText="Delete"
        variant="warn"
      />
    </ExerciseContainer>
  );
}
