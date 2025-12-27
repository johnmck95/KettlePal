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
import { CreateWorkoutState } from "../../Hooks/useCreateWorkoutForm";
import useCreateExerciseForm from "../../Hooks/useCreateExerciseForm";
import "../../Styles/CustomSelect.css";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import theme from "../../Constants/theme";
import { useUser } from "../../Contexts/UserContext";

interface CreateExerciseProps {
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  trackingIndex: number;
  submitted: boolean;
  setFormHasErrors: (value: boolean) => void;
  trackWorkout: boolean;
  mutatingWorkout?: boolean;
  showComments: boolean;
  renderMobileView?: boolean;
}

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  trackingIndex,
  submitted,
  setFormHasErrors,
  trackWorkout,
  showComments,
  renderMobileView,
}: CreateExerciseProps) {
  const user = useUser().user;
  const {
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
  } = useCreateExerciseForm({
    user,
    exercise,
    exerciseIndex,
    trackingIndex,
    handleExercise,
    deleteExercise,
    setFormHasErrors,
  });

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
    >
      {trackWorkout ? (
        <Text w="100%" color={theme.colors.grey[600]}>
          <i>{formatExerciseString(exercise)}</i>
        </Text>
      ) : (
        <>
          <SimpleGrid
            gap={1}
            templateColumns={{
              base: renderMobileView ? "41% 32% 24%" : "47% 27% 21%",
              lg: renderMobileView ? "" : "34% 8% 8% 20% 15% 12%",
            }}
            w="100%"
          >
            {/* TITLE */}
            <GridItem colSpan={1}>
              <ExerciseTitle
                submitted={submitted}
                titleIsInvalid={titleIsInvalid}
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
                submitted={submitted}
                setsIsInvalid={setsIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* REPS */}
            <GridItem colSpan={1}>
              <ExerciseReps
                submitted={submitted}
                repsIsInvalid={repsIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* REPS DISPLAY */}
            <GridItem colSpan={1}>
              <ExerciseRepsDisplay
                submitted={submitted}
                repsDisplayIsInvalid={repsDisplayIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </GridItem>

            {/* WEIGHT */}
            <GridItem colSpan={1}>
              <ExerciseWeight
                submitted={submitted}
                weightIsInvalid={weightIsInvalid}
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
                submitted={submitted}
                weightUnitIsInvalid={weightUnitIsInvalid}
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
              placeholderText="Add an Exercise Comment"
              comment={exercise.comment}
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
