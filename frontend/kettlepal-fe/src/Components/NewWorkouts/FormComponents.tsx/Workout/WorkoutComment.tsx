import { CreateWorkoutState } from "../../CreateWorkout";
import { FormControl } from "@chakra-ui/react";
import AddComment from "../Generic/AddComment";

interface WorkoutCommentProps {
  addWorkoutComment: boolean;
  state: CreateWorkoutState;
  setComment: (newComment: string) => void;
}

export default function WorkoutComment({
  addWorkoutComment,
  state,
  setComment,
}: WorkoutCommentProps) {
  return (
    <FormControl mb="1rem">
      {addWorkoutComment && (
        <AddComment
          placeholderText="Add a Workout Comment"
          comment={state.comment}
          setComment={setComment}
        />
      )}
    </FormControl>
  );
}
