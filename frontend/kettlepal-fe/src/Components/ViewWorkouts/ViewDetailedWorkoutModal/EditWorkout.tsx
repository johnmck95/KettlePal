import {
  HStack,
  VStack,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import WorkoutComment from "../../NewWorkouts/FormComponents/NewWorkout/Workout/WorkoutComment";
import WorkoutDate from "../../NewWorkouts/FormComponents/NewWorkout/Workout/WorkoutDate";
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
import WorkoutStopwatch from "../../NewWorkouts/FormComponents/NewWorkout/Workout/WorkoutStopwatch";
import theme from "../../../Constants/theme";

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

    if (formHasErrors()) {
      return;
    }

    try {
      const formattedWorkoutWithExercises = {
        date: state.date.value,
        comment: state.comment.value,
        elapsedSeconds: state.elapsedSeconds.value,
        exercises: state.exercises.map((e) => {
          return {
            uid: e.uid ?? "",
            title: e.title.value,
            weight: e.weight.value,
            weightUnit: e.weightUnit.value,
            sets: e.sets.value,
            reps: e.reps.value,
            repsDisplay: e.repsDisplay.value,
            comment: e.comment.value,
            elapsedSeconds: e.elapsedSeconds.value,
            multiplier: e.multiplier.value,
            key: e.key ?? "",
          };
        }),
      };
      // mutate workoutwithexercises to DB
      updateWorkoutWithExercises({
        variables: {
          workoutUid: workoutWithExercises?.uid ?? "",
          workoutWithExercises: formattedWorkoutWithExercises,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  const errors = [
    ...state.date.errors,
    ...state.comment.errors,
    ...state.elapsedSeconds.errors,
  ];

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
            <HStack
              mt={["3rem", "2rem"]}
              w="100%"
              justifyContent={"space-between"}
            >
              <WorkoutDate
                submitted={submitted}
                date={state.date.value}
                handleStateChange={handleStateChange}
              />
              <Box>
                <WorkoutStopwatch
                  seconds={state.elapsedSeconds.value}
                  isActive={false}
                  setTime={setTime}
                  handleIsActive={null}
                  omitControls={true}
                />
              </Box>
            </HStack>

            <WorkoutComment
              commentIsInvalid={submitted && state.comment.errors.length > 0}
              addComments={true}
              comment={state.comment.value}
              showLabel={true}
              setComment={setComment}
            />
            <VStack
              w="100%"
              spacing={0}
              alignItems="flex-start"
              mb={errors.length > 0 ? "1rem" : "0rem"}
            >
              {errors.map((error) => {
                if (!submitted) {
                  return null;
                }
                return (
                  <Text key={error} color={theme.colors.error} fontSize="xs">
                    • {error}
                  </Text>
                );
              })}
            </VStack>

            {/* EXERCISES */}
            {state.exercises?.map((exercise, index) => {
              return (
                <CreateExercise
                  key={index}
                  exercise={exercise}
                  handleExercise={handleExercise}
                  deleteExercise={deleteExercise}
                  exerciseIndex={index}
                  trackingIndex={state.exercises.length - index - 1}
                  submitted={submitted}
                  trackWorkout={false}
                  showComments={true}
                  forceMobileStyle={true}
                  forceCloseButton={true}
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
