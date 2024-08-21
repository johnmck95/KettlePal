import React, { ChangeEvent, useEffect, useState } from "react";
import CreateExercise from "./CreateExercise";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import { getCurrentDate } from "../../utils/Time/time";
import Timer from "../../Components/Timer";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import theme from "../../Constants/theme";
import ConfirmModal from "../ConfirmModal";
import { gql, useMutation } from "@apollo/client";
import { useUser } from "../../Contexts/UserContext";
import LoadingSpinner from "../LoadingSpinner";

export type CreateWorkoutState = {
  createdAt: string;
  comment: string;
  startTime: Date | null;
  endTime: Date | null;
  exercises: Array<{
    title: string;
    weight: number;
    weightUnit: string;
    sets: number;
    reps: number;
    repsDisplay: string;
    comment: string;
    startTime: Date | null;
    endTime: Date | null;
  }>;
};

const ADD_WORKOUT_WITH_EXERCISES = gql`
  mutation addWorkoutWithExercises(
    $userUid: ID!
    $workoutWithExercises: AddWorkoutWithExercisesInput!
  ) {
    addWorkoutWithExercises(
      userUid: $userUid
      workoutWithExercises: $workoutWithExercises
    ) {
      uid
      userUid
      exercises {
        uid
        title
      }
    }
  }
`;

export default function CreateWorkout() {
  const [state, setState] = useState<CreateWorkoutState>({
    createdAt: getCurrentDate(),
    comment: "",
    startTime: null,
    endTime: null,
    exercises: [],
  });
  const [addWorkoutComment, setAddWorkoutComment] = useState<boolean>(false);
  const [addWorkoutWithExercises, { loading, error }] = useMutation(
    ADD_WORKOUT_WITH_EXERCISES
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formHasErrors, setFormHasErrors] = useState<boolean>(false);
  const { uid: userUid } = useUser();

  const setTime = (newTime: Date, stateName: "startTime" | "endTime") => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      [stateName]: newTime,
    }));
  };

  const setComment = (newComment: string) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      comment: newComment,
    }));
  };

  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleAddExercise(): void {
    setState((prevState) => ({
      ...prevState,
      exercises: [
        ...prevState.exercises,
        {
          title: "",
          weight: 0,
          weightUnit: "kg",
          sets: 0,
          reps: 0,
          repsDisplay: "std",
          comment: "",
          startTime: null,
          endTime: null,
        },
      ],
    }));
  }

  function deleteExercise(index: number): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.filter((_, i) => i !== index),
    }));
  }

  function handleExercise(
    name: string,
    value: string | number,
    index: number
  ): void {
    if (
      (name === "weight" || name === "sets" || name === "reps") &&
      typeof value === "string"
    ) {
      value = parseFloat(value);
    }
    setState((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.map((exercise, i) => {
        if (i === index) {
          return {
            ...exercise,
            [name]: value,
          };
        }
        return exercise;
      }),
    }));
  }

  // Save Workout Modal Controls
  const {
    isOpen: isOpenSaveWorkout,
    onOpen: onOpenSaveWorkout,
    onClose: onCloseSaveWorkout,
  } = useDisclosure();

  async function onSaveWorkout(): Promise<void> {
    setSubmitted(true);
    onCloseSaveWorkout();

    // Client-side validation
    if (formHasErrors) {
      return;
    }

    // Try to write to DB
    try {
      await addWorkoutWithExercises({
        variables: {
          userUid,
          workoutWithExercises: state,
        },
      });
      setState({
        createdAt: getCurrentDate(),
        comment: "",
        startTime: null,
        endTime: null,
        exercises: [],
      });
    } catch (err) {
      console.error("Error submitting workout with exercises: ", err);
    }
  }

  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
      setTimeout(() => {
        setShowServerError(false);
      }, 5000);
    }
  }, [error]);

  if (loading) {
    return (
      <Center>
        <LoadingSpinner size={24} />
      </Center>
    );
  }

  return (
    <Box m="0.5rem" w={["100%", "100%", "720px"]}>
      {/* DATE */}
      <HStack justifyContent={"space-around"} pb="0.5rem">
        <FormControl isRequired isInvalid={submitted && !state.createdAt}>
          <FormLabel fontSize={["sm", "lg"]}>Workout Date</FormLabel>
          <Input
            size={["sm", "lg"]}
            name="createdAt"
            type="date"
            bg="white"
            maxW="180px"
            value={state.createdAt}
            onChange={handleStateChange}
            border="1px solid grey"
            borderRadius={"5px"}
          />
        </FormControl>

        {/* TIMER */}
        <Timer
          showStartStop={true}
          autoStart={false}
          startTime={state.startTime}
          endTime={state.endTime}
          setTime={setTime}
        />
      </HStack>

      {/* WORKOUT COMMENT */}
      <FormControl>
        <FormLabel
          as="button"
          variant="link"
          fontSize={["sm", "lg"]}
          onClick={() => setAddWorkoutComment((prev) => !prev)}
        >
          {addWorkoutComment ? "Hide Comment" : "Add Comment"}
        </FormLabel>
        {addWorkoutComment && (
          <AddComment
            placeholderText="Add a Workout Comment"
            comment={state.comment}
            setComment={setComment}
          />
        )}
      </FormControl>

      {/* EXERCISES */}
      <Box>
        {state.exercises.map((exercise, index) => {
          return (
            <CreateExercise
              key={index}
              exercise={exercise}
              handleExercise={handleExercise}
              deleteExercise={deleteExercise}
              exerciseIndex={index}
              submitted={submitted}
              setFormHasErrors={setFormHasErrors}
            />
          );
        })}
      </Box>

      <Flex w="100%" justifyContent={"space-between"}>
        <Button
          variant="primary"
          onClick={handleAddExercise}
          leftIcon={<FaPlusCircle />}
        >
          Add Exercise
        </Button>
        {state.exercises.length > 0 && (
          <Button
            variant="secondary"
            leftIcon={<FaSave />}
            disabled={true}
            onClick={onOpenSaveWorkout}
          >
            Save Workout
          </Button>
        )}
      </Flex>

      {error && showServerError && (
        <Alert status="error" mt="2rem" borderRadius={"8px"}>
          <AlertIcon />
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      )}

      <ConfirmModal
        isOpen={isOpenSaveWorkout}
        onClose={onCloseSaveWorkout}
        onConfirmation={onSaveWorkout}
        ModalTitle="Save Workout"
        ModalBodyText="Are you sure your workout is complete, and ready to be saved?"
        CloseText="Cancel"
        ProceedText="Save"
        variant="confirm"
      />
    </Box>
  );
}
