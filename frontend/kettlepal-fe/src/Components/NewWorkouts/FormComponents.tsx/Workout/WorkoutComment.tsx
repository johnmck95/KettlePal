import { FormControl, FormLabel } from "@chakra-ui/react";
import AddComment from "../Generic/AddComment";

interface WorkoutCommentProps {
  addWorkoutComment: boolean;
  comment: string;
  showLabel?: boolean;
  setComment: (newComment: string) => void;
}

export default function WorkoutComment({
  addWorkoutComment,
  comment,
  showLabel,
  setComment,
}: WorkoutCommentProps) {
  return (
    <FormControl mb="1rem">
      {showLabel && (
        <FormLabel fontSize={["sm", "lg"]} mb="4px" alignSelf="flex-start">
          <b>Workout Comment</b>
        </FormLabel>
      )}
      {addWorkoutComment && (
        <AddComment
          placeholderText="Add a Workout Comment"
          comment={comment}
          setComment={setComment}
        />
      )}
    </FormControl>
  );
}
