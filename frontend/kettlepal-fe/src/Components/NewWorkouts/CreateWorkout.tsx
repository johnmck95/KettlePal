import React, { ChangeEvent, useState } from "react";
import CreateExercise from "./CreateExercise";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import { getCurrentDate } from "../../Functions/Time/time";
import Timer from "../../Components/Timer";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import theme from "../../Constants/theme";
import ConfirmModal from "../ConfirmModal";
import { gql, useMutation } from "@apollo/client";
import { useUser } from "../../Contexts/UserContext";

export type CreateWorkoutState = {
  createdAt: string;
  comment: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
  exercises: Array<{
    title: string;
    weight: number;
    weightUnit: string;
    sets: number;
    reps: number;
    repsDisplay: string;
    comment: string;
    startTime: Date | undefined;
    endTime: Date | undefined;
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
    startTime: undefined,
    endTime: undefined,
    exercises: [],
  });
  const [addWorkoutComment, setAddWorkoutComment] = useState<boolean>(false);
  const [addWorkoutWithExercises] = useMutation(ADD_WORKOUT_WITH_EXERCISES);
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
          repsDisplay: "standard",
          comment: "",
          startTime: undefined,
          endTime: undefined,
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
    // TODO: After confirm modal 'continue' is pressed,
    // trigger the gql mutation to save the workout wth exercises to DB
    onCloseSaveWorkout();

    try {
      const result = await addWorkoutWithExercises({
        variables: {
          userUid,
          workoutWithExercises: state,
        },
      });
      setState({
        createdAt: getCurrentDate(),
        comment: "",
        startTime: undefined,
        endTime: undefined,
        exercises: [],
      });
    } catch (err) {
      console.error("Error submitting workout with exercises: ", err);
    }
  }

  return (
    <Box m="0.5rem">
      {/* DATE */}
      <HStack justifyContent={"space-around"} pb="0.5rem">
        <FormControl>
          <FormLabel fontSize={["sm", "lg"]}>Workout Date</FormLabel>
          <Input
            size={["sm", "lg"]}
            name="createdAt"
            type="date"
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
            />
          );
        })}
      </Box>

      <Flex w="100%" justifyContent={"space-between"}>
        <Button
          color={theme.colors.green[700]}
          borderColor={theme.colors.green[400]}
          leftIcon={<FaPlusCircle />}
          variant="outline"
          onClick={handleAddExercise}
        >
          Add Exercise
        </Button>
        {state.exercises.length > 0 && (
          <Button
            color={theme.colors.green[700]}
            borderColor={theme.colors.green[400]}
            leftIcon={<FaSave />}
            variant="outline"
            disabled={true}
            onClick={onOpenSaveWorkout}
          >
            Save Workout
          </Button>
        )}
      </Flex>

      <ConfirmModal
        isOpen={isOpenSaveWorkout}
        onClose={onCloseSaveWorkout}
        onConfirmation={onSaveWorkout}
        ModalTitle="Save Workout"
        ModalBodyText="Are you sure your workout is complete, and ready to be saved?"
        CloseText="Cancel"
        ProceedText="Save"
      />
    </Box>
  );
}
