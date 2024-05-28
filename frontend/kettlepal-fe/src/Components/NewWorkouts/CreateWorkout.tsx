import React, { ChangeEvent, useState } from "react";
import CreateExercise from "./CreateExercise";

import { Box, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import AddComment from "../AddComment";
import { getCurrentDate } from "../../Functions/Time/time";
import Timer from "../../Components/Timer";

type CreateWorkoutState = {
  date: string;
  workoutComment: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
};

export default function CreateWorkout() {
  const [state, setState] = useState<CreateWorkoutState>({
    date: getCurrentDate(),
    workoutComment: "",
    startTime: undefined,
    endTime: undefined,
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

  return (
    <Box m="0.5rem">
      {/* DATE */}
      {/* TIMER */}
      <HStack justifyContent={"space-around"}>
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

        <Timer
          showStartStop={true}
          autoStart={false}
          startTime={state.startTime}
          endTime={state.endTime}
          setTime={setTime}
        />
      </HStack>

      {/* COMMENT */}
      <FormControl>
        <FormLabel
          as="button"
          variant="link"
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

      {/* <CreateExercise /> */}
    </Box>
  );
}
