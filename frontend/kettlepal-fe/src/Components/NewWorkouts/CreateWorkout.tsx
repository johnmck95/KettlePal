import React, { ChangeEvent, useState } from "react";
import CreateExercise from "./CreateExercise";

import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import AddComment from "../AddComment";
import { getCurrentDate } from "../../Functions/Time/time";

type CreateWorkoutState = {
  date: string;
  workoutComment: string;
};

export default function CreateWorkout() {
  const [state, setState] = useState<CreateWorkoutState>({
    date: getCurrentDate(),
    workoutComment: "",
  });
  const [addWorkoutComment, setAddWorkoutComment] = useState<boolean>(false);

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

  //   console.log(state);
  return (
    <Box m="0.5rem">
      {/* DATE */}
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
          p="0.5rem"
        />
      </FormControl>

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