import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import theme from "../../../../Constants/theme";
import { CreateWorkoutState } from "../../../../Hooks/useCreateWorkoutForm";

interface ExerciseRepsProps {
  submitted: boolean;
  repsIsInvalid: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseReps({
  submitted,
  repsIsInvalid,
  exercise,
  exerciseIndex,
  handleExercise,
}: ExerciseRepsProps) {
  return (
    <FormControl w="15%" isInvalid={submitted && repsIsInvalid}>
      <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
        <Text>Reps</Text>
      </FormLabel>
      <Input
        fontSize={["12px", "14px", "16px"]}
        size={["sm", "sm", "md"]}
        type="number"
        name="reps"
        placeholder="0"
        value={exercise.reps}
        onChange={(event) =>
          handleExercise("reps", event.target.value, exerciseIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={!!exercise.reps ? theme.colors.black : theme.colors.grey[500]}
      />
    </FormControl>
  );
}
