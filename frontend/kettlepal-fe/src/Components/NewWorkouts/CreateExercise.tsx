import React from "react";

import { HStack, Button } from "@chakra-ui/react";
import AddComment from "./FormComponents.tsx/Generic/AddComment";
import ConfirmModal from "../ConfirmModal";
import theme from "../../Constants/theme";
import ExerciseTitle from "./FormComponents.tsx/Exercise/ExerciseTitle";
import ExerciseWeight from "./FormComponents.tsx/Exercise/ExerciseWeight";
import ExerciseSets from "./FormComponents.tsx/Exercise/ExerciseSets";
import ExerciseReps from "./FormComponents.tsx/Exercise/ExerciseReps";
import ExerciseRepsDisplay from "./FormComponents.tsx/Exercise/ExerciseRepsDisplay";
import ExerciseWeightUnit from "./FormComponents.tsx/Exercise/ExerciseWeightUnit";
import ExerciseTimer from "./FormComponents.tsx/Exercise/ExerciseTimer";
import TrackExercise from "./FormComponents.tsx/MidWorkoutTracking/TrackExercise";
import { ExerciseContainer } from "./FormComponents.tsx/Exercise/ExerciseContainer";
import { CreateWorkoutState } from "../../Hooks/useCreateWorkoutForm";
import useCreateExerciseForm from "../../Hooks/useCreateExerciseForm";

interface CreateExerciseProps {
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  submitted: boolean;
  setFormHasErrors: (value: boolean) => void;
  trackWorkout: boolean;
  mutatingWorkout?: boolean;
}

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  submitted,
  setFormHasErrors,
  trackWorkout,
  mutatingWorkout,
}: CreateExerciseProps) {
  const {
    completedSets,
    customTitle,
    customWeight,
    errors,
    isOpenDeleteExercise,
    minSwipeDistance,
    offset,
    seeDetails,
    timerIsActive,
    repsDisplayIsInvalid,
    repsIsInvalid,
    setsIsInvalid,
    timerIsInvalid,
    titleIsInvalid,
    weightIsInvalid,
    weightUnitIsInvalid,
    completedASet,
    customOnCloseDeleteExercise,
    handleTimerIsActive,
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
    setSeeDetails,
    setTime,
    swipeDistance,
  } = useCreateExerciseForm({
    exercise,
    handleExercise,
    deleteExercise,
    exerciseIndex,
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
      <HStack w="100%" mb="0.25rem">
        {/* TITLE */}
        <ExerciseTitle
          submitted={submitted}
          titleIsInvalid={titleIsInvalid}
          customTitle={customTitle}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          setCustomTitle={setCustomTitle}
          handleExercise={handleExercise}
        />

        {/* WEIGHT */}
        <ExerciseWeight
          submitted={submitted}
          weightIsInvalid={weightIsInvalid}
          customWeight={customWeight}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          setCustomWeight={setCustomWeight}
          handleExercise={handleExercise}
        />

        {/* SETS */}
        <ExerciseSets
          submitted={submitted}
          setsIsInvalid={setsIsInvalid}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          handleExercise={handleExercise}
        />

        {/* REPS */}
        <ExerciseReps
          submitted={submitted}
          repsIsInvalid={repsIsInvalid}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          handleExercise={handleExercise}
        />
      </HStack>

      {/* SEE DETAILS */}
      <Button
        fontSize={[12, 14, 16]}
        alignSelf={"flex-start"}
        size={["xs", "sm", "md"]}
        variant="secondary"
        onClick={() => setSeeDetails((prev) => !prev)}
        textAlign="left"
        color={
          submitted &&
          !seeDetails &&
          (weightUnitIsInvalid || repsDisplayIsInvalid || timerIsInvalid)
            ? theme.colors.error
            : theme.colors.feldgrau[700]
        }
        sx={{
          _focus: {
            borderColor: theme.colors.green[300],
            boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
          },
        }}
      >
        {seeDetails ? "Hide Details" : "More Details"}
      </Button>
      <HStack
        w="100%"
        justifyContent={seeDetails ? "space-between" : "flex-start"}
        alignItems="flex-start"
      >
        {seeDetails && (
          <HStack
            w="100%"
            justifyContent="space-between"
            alignItems="flex-end"
            mt={mutatingWorkout ? 0 : "-0.75rem"}
          >
            <HStack>
              {/* REPS DISPLAY */}
              <ExerciseRepsDisplay
                submitted={submitted}
                repsDisplayIsInvalid={repsDisplayIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />

              {/* WEIGHT UNIT */}
              <ExerciseWeightUnit
                submitted={submitted}
                weightUnitIsInvalid={weightUnitIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </HStack>

            {/* EXERCISE TIMER */}
            <ExerciseTimer
              exercise={exercise}
              timerIsActive={timerIsActive}
              handleTimerIsActive={mutatingWorkout ? null : handleTimerIsActive}
              setTime={setTime}
            />
          </HStack>
        )}
      </HStack>

      {/* EXERCISE COMMENT */}
      {seeDetails && (
        <AddComment
          placeholderText="Add an Exercise Comment"
          comment={exercise.comment}
          setComment={setExerciseComment}
          maxWidth="100%"
        />
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
