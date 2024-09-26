import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { CreateWorkoutState } from "../../CreateWorkout";
import theme from "../../../../Constants/theme";

interface ExerciseSetsProps {
  submitted: boolean;
  setsIsInvalid: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseSets({
  submitted,
  setsIsInvalid,
  exercise,
  exerciseIndex,
  handleExercise,
}: ExerciseSetsProps) {
  return (
    <FormControl w="15%" isInvalid={submitted && setsIsInvalid}>
      <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
        Sets
      </FormLabel>
      <Input
        size={["sm", "sm", "md"]}
        fontSize={["12px", "14px", "16px"]}
        placeholder="0"
        autoComplete="off"
        type="number"
        name="sets"
        value={exercise.sets}
        onChange={(event) =>
          handleExercise("sets", event.target.value, exerciseIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={!!exercise.sets ? theme.colors.black : theme.colors.grey[500]}
      />
    </FormControl>
  );
}
