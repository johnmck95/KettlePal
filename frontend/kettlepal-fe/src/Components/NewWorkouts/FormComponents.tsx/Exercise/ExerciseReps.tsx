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
    <FormControl
      flexGrow={0.5}
      flexShrink={0.5}
      flexBasis={["30px", "35px", "55px"]}
      isInvalid={submitted && repsIsInvalid}
    >
      <FormLabel fontSize={["14px", "16px"]} m="0">
        <Text>Reps</Text>
      </FormLabel>
      <Input
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        type="number"
        name="reps"
        placeholder="0"
        padding="0.5rem"
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
