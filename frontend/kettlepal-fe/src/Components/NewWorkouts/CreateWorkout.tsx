import React, { useState } from "react";
import CreateExercise from "./CreateExercise";

import { Box } from "@chakra-ui/react";
import AddComment from "../AddComment";

type CreateWorkoutState = {
  workoutComment: string;
};

export default function CreateWorkout() {
  const [state, setState] = useState<CreateWorkoutState>({
    workoutComment: "",
  });

  const setComment = (newComment: string) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      workoutComment: newComment,
    }));
  };

  console.log(state);
  return (
    <Box m="0.5rem">
      <AddComment comment={state.workoutComment} setComment={setComment} />
      <CreateExercise />
    </Box>
  );
}
