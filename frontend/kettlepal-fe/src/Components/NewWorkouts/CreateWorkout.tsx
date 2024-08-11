import React, { ChangeEvent, useState } from "react";
import CreateExercise from "./CreateExercise";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import { getCurrentDate } from "../../Functions/Time/time";
import Timer from "../../Components/Timer";
import { FaPlusCircle } from "react-icons/fa";
import theme from "../../Constants/theme";

export type CreateWorkoutState = {
  date: string;
  workoutComment: string;
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

export default function CreateWorkout() {
  const [state, setState] = useState<CreateWorkoutState>({
    date: getCurrentDate(),
    workoutComment: "",
    startTime: undefined,
    endTime: undefined,
    exercises: [],
  });
  const [addWorkoutComment, setAddWorkoutComment] = useState<boolean>(false);

  const setTime = (newTime: Date, stateName: "startTime" | "endTime") => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      [stateName]: newTime,
    }));
  };

  const setComment = (newComment: string) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      workoutComment: newComment,
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
          weightUnit: "",
          sets: 0,
          reps: 0,
          repsDisplay: "",
          comment: "",
          startTime: undefined,
          endTime: undefined,
        },
      ],
    }));
  }

  function handleExercise(name: string, value: any, index: number): void {
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

  return (
    <Box m="0.5rem">
      {/* DATE */}
      <HStack justifyContent={"space-around"} pb="0.5rem">
        <FormControl>
          <FormLabel fontSize={["sm", "lg"]}>Workout Date</FormLabel>
          <Input
            size={["sm", "lg"]}
            name="date"
            type="date"
            maxW="180px"
            value={state.date}
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
            comment={state.workoutComment}
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
              exerciseIndex={index}
            />
          );
        })}
      </Box>

      <Button
        color={theme.colors.green[700]}
        borderColor={theme.colors.green[400]}
        leftIcon={<FaPlusCircle />}
        variant="outline"
        onClick={handleAddExercise}
      >
        Add Exercise
      </Button>
    </Box>
  );
}
