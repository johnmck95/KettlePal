import {
  HStack,
  VStack,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import WorkoutTimer from "../../NewWorkouts/FormComponents.tsx/Workout/WorkoutTimer";
import WorkoutComment from "../../NewWorkouts/FormComponents.tsx/Workout/WorkoutComment";
import WorkoutDate from "../../NewWorkouts/FormComponents.tsx/Workout/WorkoutDate";
import { useState } from "react";
import {
  FuzzySearchQuery,
  useUpdateWorkoutWithExercisesMutation,
} from "../../../generated/frontend-types";
import React from "react";
import CreateExercise from "../../NewWorkouts/CreateExercise";
import useUpdateWorkoutWithExercisesForm from "../../../Hooks/useUpdateWorkoutWithExercisesForm";
import ConfirmModal from "../../ConfirmModal";
import BeforeAfterConfirmModalConent from "./BeforeAfterConfirmModalContent";
import LoadingSpinner from "../../LoadingSpinner";

interface EditWorkoutProps {
  workoutWithExercises: NonNullable<
    NonNullable<FuzzySearchQuery["pastWorkouts"]>["workoutWithExercises"]
  >[0];
  refetchPastWorkouts: () => void;
  isOpen: boolean;
  onClose: () => void;
  setShowUploadSuccess: (value: boolean) => void;
  setEditing: (value: boolean) => void;
}

export default function EditWorkout({
  workoutWithExercises,
  isOpen,
  onClose,
  refetchPastWorkouts,
  setShowUploadSuccess,
  setEditing,
}: EditWorkoutProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showServerError, setShowServerError] = useState<boolean>(false);

  const {
    state,
    formHasErrors,
    handleStateChange,
    setTime,
    setComment,
    deleteExercise,
    handleExercise,
    setFormHasErrors,
  } = useUpdateWorkoutWithExercisesForm({ workoutWithExercises });

  const [updateWorkoutWithExercises, { loading, error }] =
    useUpdateWorkoutWithExercisesMutation({
      onCompleted: () => {
        setEditing(false);
        refetchPastWorkouts();
        setShowUploadSuccess(true);
        setTimeout(() => {
          setShowUploadSuccess(false);
        }, 5000);
      },
      onError: (e) => {
        setShowServerError(true);
      },
    });

  function onUpdateWorkouWithExercises() {
    setSubmitted(true);
    onClose();

    if (formHasErrors) {
      return;
    }

    try {
      // mutate workoutwithexercises to DB
      updateWorkoutWithExercises({
        variables: {
          workoutUid: workoutWithExercises?.uid ?? "",
          workoutWithExercises: state,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <VStack w="100%">
      <>
        {error && showServerError && (
          <Alert
            status="error"
            mt="3rem"
            maxW="500px"
            w="100%"
            borderRadius={"8px"}
            justifyContent={"space-between"}
          >
            <HStack>
              <AlertIcon />
              {error?.message && (
                <AlertDescription>{error?.message}</AlertDescription>
              )}
            </HStack>
            <CloseButton
              alignSelf="flex-start"
              onClick={() => setShowServerError(false)}
            />
          </Alert>
        )}
        {loading ? (
          <Box mt="4rem" mb="2rem">
            <LoadingSpinner />
          </Box>
        ) : (
          <>
            <HStack mt="2.5rem" w="100%">
              <WorkoutDate
                submitted={submitted}
                date={state.date}
                handleStateChange={handleStateChange}
              />
              <Box w="175px">
                <WorkoutTimer
                  elapsedSeconds={state.elapsedSeconds}
                  timerIsActive={false}
                  handleTimerIsActive={null}
                  setTime={setTime}
                />
              </Box>
            </HStack>

            <WorkoutComment
              addComments={true}
              comment={state.comment}
              showLabel={true}
              setComment={setComment}
            />

            {/* EXERCISES */}
            {state.exercises?.map((exercise, index) => {
              return (
                <CreateExercise
                  key={index}
                  exercise={exercise}
                  handleExercise={handleExercise}
                  deleteExercise={deleteExercise}
                  exerciseIndex={index}
                  submitted={submitted}
                  setFormHasErrors={setFormHasErrors}
                  trackWorkout={false}
                  mutatingWorkout={true}
                  showComments={true}
                />
              );
            })}
          </>
        )}

        {/* CONFIRM SAVE EXERCISE MODAL */}
        <ConfirmModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirmation={onUpdateWorkouWithExercises}
          ModalTitle="Update Workout"
          ModalBodyText={
            <BeforeAfterConfirmModalConent
              before={workoutWithExercises}
              after={state}
            />
          }
          CloseText="Cancel"
          ProceedText="Save"
          variant="confirm"
        />
      </>
    </VStack>
  );
}
