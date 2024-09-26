import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  IconButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import theme from "../../../Constants/theme";
import { formatExerciseString } from "../../../utils/Exercises/exercises";
import { formatDurationShort } from "../../../utils/Time/time";
import {
  UserWithWorkoutsQuery,
  useDeleteExerciseMutation,
  useUpdateExerciseMutation,
} from "../../../generated/frontend-types";
import { FaMinus, FaPencilAlt, FaSave } from "react-icons/fa";
import CreateExercise from "../../NewWorkouts/CreateExercise";
import { CreateWorkoutState } from "../../NewWorkouts/CreateWorkout";
import ConfirmModal from "../../ConfirmModal";
import LoadingSpinner from "../../LoadingSpinner";
import Detail from "./Detail";

export default function ViewDetailedExercise({
  exercise,
  showDetails,
  refetchPastWorkouts,
}: {
  exercise: NonNullable<
    NonNullable<
      NonNullable<UserWithWorkoutsQuery["user"]>["workouts"][0]
    >["exercises"]
  >[0];
  showDetails: boolean;
  refetchPastWorkouts: () => void;
}) {
  const [editExercise, setEditExercise] = React.useState(false);
  const {
    uid,
    title,
    elapsedSeconds,
    sets,
    reps,
    repsDisplay,
    weight,
    weightUnit,
    comment,
  } = exercise;

  const [editableExercise, setEditableExercise] = useState<
    Omit<CreateWorkoutState["exercises"][0], "key">
  >({
    title,
    weight: weight?.toString() ?? "",
    weightUnit: weightUnit ?? "",
    sets: sets?.toString() ?? "",
    reps: reps?.toString() ?? "",
    repsDisplay: repsDisplay ?? "",
    comment: comment ?? "",
    elapsedSeconds: elapsedSeconds ?? 0,
  });

  function handleExercise(name: string, value: string | number): void {
    setEditableExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Save Exercise Modal Controls
  const {
    isOpen: isOpenExercise,
    onOpen: onOpenExercise,
    onClose: onCloseExercise,
  } = useDisclosure();

  const [submitted, setSubmitted] = useState(false);
  const [formHasErrors, setFormHasErrors] = useState<boolean>(false);
  const [showServerError, setShowServerError] = useState<boolean>(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState<boolean>(false);

  const [
    updateExerciseMutation,
    { loading: updateExerciseIsLoading, error: updateExerciseError },
  ] = useUpdateExerciseMutation({
    onCompleted: () => {
      refetchPastWorkouts();
      setShowUploadSuccess(true);
      setTimeout(() => {
        setShowUploadSuccess(false);
      }, 5000);
      setEditExercise(false);
    },
    onError: (error) => {
      setShowServerError(true);
      console.error("Error updating exercise: ", error.message);
    },
  });

  async function onSaveExercise() {
    setSubmitted(true);
    onCloseExercise();
    // Client-side validation
    if (formHasErrors) {
      return;
    }
    // Try to write to DB
    try {
      await updateExerciseMutation({
        variables: {
          uid,
          edits: editableExercise,
        },
      });
    } catch (error) {
      console.error("Error updating exercise: ", error);
    }
  }

  const [
    deleteExerciseMutation,
    { loading: deleteExerciseIsLoading, error: deleteExerciseError },
  ] = useDeleteExerciseMutation({
    onCompleted: () => {
      refetchPastWorkouts();
      setEditExercise(false);
    },
    onError: (error) => {
      setShowServerError(true);
      console.error("Error deleting exercise: ", error.message);
    },
  });

  async function deleteExercise() {
    try {
      await deleteExerciseMutation({
        variables: {
          uid,
        },
      });
    } catch (error) {
      console.error("Error deleting exercise: ", error);
    }
  }

  return (
    <VStack
      w="100%"
      alignItems={"flex-start"}
      gap={0}
      color={theme.colors.grey[800]}
      my="0.5rem"
    >
      <HStack
        w="100%"
        justifyContent="space-between"
        alignContent="center"
        my={showDetails ? "0.5rem" : 0}
      >
        <Text fontSize={showDetails ? "xl" : "md"} color={theme.colors.black}>
          <b>{formatExerciseString(exercise)}</b>
        </Text>
        <HStack my="0.15rem">
          {editExercise && (
            <IconButton
              variant="primary"
              aria-label="Save Exercise"
              size="sm"
              icon={<FaSave />}
              onClick={onOpenExercise}
            />
          )}

          <IconButton
            variant="secondary"
            aria-label="Edit Exercise"
            size="sm"
            icon={editExercise ? <FaMinus /> : <FaPencilAlt />}
            onClick={() => setEditExercise((prev) => !prev)}
          />
        </HStack>
      </HStack>

      {/* SUCCESSFULLY UPDATED EXERCISE */}
      {showUploadSuccess && (
        <Alert status="success" my="1rem" borderRadius={"8px"} bg="green.50">
          <AlertIcon />
          Exercise Updated Successfully!
        </Alert>
      )}

      {/* ERROR WHILE UPDATING EXERCISE */}
      {showServerError && (!!updateExerciseError || !!deleteExerciseError) && (
        <Alert
          status="error"
          my="1rem"
          maxW="500px"
          w="100%"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <VStack alignItems={"flex-start"}>
              {updateExerciseError?.message && (
                <AlertDescription>
                  {updateExerciseError?.message}
                </AlertDescription>
              )}
              {deleteExerciseError?.message && (
                <AlertDescription>
                  {deleteExerciseError?.message}
                </AlertDescription>
              )}
            </VStack>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}

      {editExercise || updateExerciseIsLoading || deleteExerciseIsLoading ? (
        <>
          {updateExerciseIsLoading || deleteExerciseIsLoading ? (
            <LoadingSpinner />
          ) : (
            <Box p="0" m="0.75rem 0 0 0">
              <CreateExercise
                exercise={editableExercise}
                handleExercise={handleExercise}
                deleteExercise={deleteExercise}
                exerciseIndex={0}
                submitted={submitted}
                setFormHasErrors={setFormHasErrors}
                trackWorkout={false}
              />
            </Box>
          )}
        </>
      ) : (
        <>
          {!!comment && showDetails && (
            <Text ml="0.5rem" fontSize="sm" color={theme.colors.grey[700]}>
              <i>{comment}</i>
            </Text>
          )}
          {showDetails && (
            <Flex
              justifyContent="space-evenly"
              flexWrap="wrap"
              mt="0.5rem"
              w="100%"
            >
              {!!elapsedSeconds && (
                <Detail
                  title={"Elapsed Time"}
                  value={formatDurationShort(elapsedSeconds ?? 0)}
                />
              )}
              {!!sets && !!reps && (
                <Detail
                  title={"Total Reps"}
                  value={`${(sets * reps).toLocaleString()}`}
                />
              )}
              {!!sets && !!reps && !!weight && !!weightUnit && (
                <Detail
                  title={"Work Capacity"}
                  value={`${(
                    sets *
                    reps *
                    weight
                  ).toLocaleString()} ${weightUnit}`}
                />
              )}
            </Flex>
          )}
        </>
      )}
      {/* CONFIRM SAVE EXERCISE MODAL */}
      <ConfirmModal
        isOpen={isOpenExercise}
        onClose={onCloseExercise}
        onConfirmation={onSaveExercise}
        ModalTitle="Save Workout"
        ModalBodyText={
          <Box mb="1rem">
            Are you sure your exercise is complete, and ready to be saved?
            <br />
            <br />
            <>
              <Text color={theme.colors.green[600]}>
                <b>
                  <i>New Exercise</i>
                </b>
              </Text>
              {formatExerciseString(editableExercise)} <br />
            </>
            <br />
            <>
              <Text color={theme.colors.grey[600]}>
                <b>
                  <i>Old Exercise</i>
                </b>
              </Text>
              {formatExerciseString(exercise)} <br />
            </>
          </Box>
        }
        CloseText="Cancel"
        ProceedText="Save"
        variant="confirm"
      />
    </VStack>
  );
}
