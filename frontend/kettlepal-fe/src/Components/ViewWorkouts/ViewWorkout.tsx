import React, { useEffect, useState } from "react";
import { WorkoutWithExercises } from "../../Constants/types";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  HStack,
  IconButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import ViewExercise from "./ViewExercise";
import theme from "../../Constants/theme";
import CalendarWidget from "../CalendarWidget";
import { FaTimes } from "react-icons/fa";
import { gql, useMutation } from "@apollo/client";
import ConfirmModal from "../ConfirmModal";
import LoadingSpinner from "../LoadingSpinner";
import ViewDetailedWorkoutModal from "./ViewDetailedWorkoutModal";

const DELETE_WORKOUT_WITH_EXERCISES = gql`
  mutation deleteWorkoutWithExercises($workoutUid: ID!) {
    deleteWorkoutWithExercises(workoutUid: $workoutUid) {
      uid
    }
  }
`;
export default function ViewWorkout({
  workoutWithExercises,
  refetchPastWorkouts,
}: {
  workoutWithExercises: WorkoutWithExercises;
  refetchPastWorkouts: () => void;
}) {
  const [deleteWorkoutWithExercises, { loading, error }] = useMutation(
    DELETE_WORKOUT_WITH_EXERCISES,
    {
      onCompleted() {
        refetchPastWorkouts();
      },
    }
  );
  const exercises: WorkoutWithExercises["exercises"] =
    workoutWithExercises.exercises;

  const { isOpen, onOpen, onClose } = useDisclosure();

  function onDeleteWorkout() {
    onClose();
    deleteWorkoutWithExercises({
      variables: {
        workoutUid: workoutWithExercises.uid,
      },
    });
  }

  const [showMutationError, setShowMutationError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowMutationError(true);
      setTimeout(() => {
        setShowMutationError(false);
      }, 5000);
    }
  }, [error]);

  const {
    isOpen: isOpenDetailedWorkout,
    onOpen: onOpenDetailedWorkout,
    onClose: onCloseDetailedWorkout,
  } = useDisclosure();

  return (
    <>
      <HStack
        w={"calc(100% - 0.6rem)"}
        maxW="720px"
        p="0.5rem"
        m="0.1rem"
        position="relative"
        borderRadius="8px"
        bg="white"
        boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
        onClick={onOpenDetailedWorkout}
      >
        {loading ? (
          <LoadingSpinner size={16} />
        ) : (
          <>
            <IconButton
              variant="closeX"
              aria-label="Delete Workout"
              icon={<FaTimes />}
              size="sm"
              position="absolute"
              top="5px"
              right="5px"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            />
            <CalendarWidget date={workoutWithExercises.createdAt} w="4rem" />
            <VStack mx="1rem">
              {exercises.map((exercise) => {
                return <ViewExercise key={exercise.uid} exercise={exercise} />;
              })}
            </VStack>

            <ConfirmModal
              isOpen={isOpen}
              onClose={onClose}
              onConfirmation={onDeleteWorkout}
              ModalTitle="Delete Workout"
              ModalBodyText={`Are you sure you want to delete this workout, and the ${
                workoutWithExercises.exercises.length
              } corresponding exercise${
                workoutWithExercises.exercises.length > 1 ? "s" : ""
              }?`}
              CloseText="Cancel"
              ProceedText="Delete"
              variant="warn"
            />
          </>
        )}

        <ViewDetailedWorkoutModal
          // key={workoutWithExercises.uid}
          workoutWithExercises={workoutWithExercises}
          isOpen={isOpenDetailedWorkout}
          onClose={onCloseDetailedWorkout}
        />
      </HStack>

      {/* MUTATION ERROR */}
      {error && showMutationError && (
        <Alert
          status="error"
          w="calc(100% - 0.6rem)"
          margin="2rem"
          borderRadius={"8px"}
        >
          <AlertIcon />
          <AlertDescription>
            Error deleting workout: {error?.message}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
