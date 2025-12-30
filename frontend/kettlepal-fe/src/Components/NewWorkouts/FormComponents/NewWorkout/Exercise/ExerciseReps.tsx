import { FormControl, FormLabel, HStack, Input, Text } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { CreateWorkoutState } from "../../../../../Hooks/useCreateWorkoutForm";
import ToolTip from "../../../../UI/ToolTip";

interface ExerciseRepsProps {
  repsIsInvalid: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseReps({
  repsIsInvalid,
  exercise,
  exerciseIndex,
  handleExercise,
}: ExerciseRepsProps) {
  return (
    <FormControl isInvalid={repsIsInvalid}>
      <HStack>
        <FormLabel fontSize={["14px", "16px"]} m="0">
          <Text>Reps</Text>
        </FormLabel>
        <ToolTip
          message={`The total number of reps, regardless of the "Type".`}
        />
      </HStack>

      <Input
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        type="number"
        name="reps"
        placeholder="0"
        padding="0.5rem"
        value={exercise.reps.value}
        onChange={(event) =>
          handleExercise("reps", event.target.value, exerciseIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={!!exercise.reps ? theme.colors.black : theme.colors.grey[500]}
      />
    </FormControl>
  );
}
