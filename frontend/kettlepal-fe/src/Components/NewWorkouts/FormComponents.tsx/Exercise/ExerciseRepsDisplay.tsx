import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { RepsDisplayOptions } from "../../../../Constants/ExercisesOptions";
import theme from "../../../../Constants/theme";
import { CreateWorkoutState } from "../../../../Hooks/useCreateWorkoutForm";

interface ExerciseRepsDisplayProps {
  submitted: boolean;
  repsDisplayIsInvalid: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseRepsDisplay({
  submitted,
  repsDisplayIsInvalid,
  exercise,
  exerciseIndex,
  handleExercise,
}: ExerciseRepsDisplayProps) {
  return (
    <FormControl isInvalid={submitted && repsDisplayIsInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Type
      </FormLabel>
      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="repsDisplay"
        value={exercise.repsDisplay}
        onChange={(event) =>
          handleExercise(event.target.name, event.target.value, exerciseIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!exercise.repsDisplay ? theme.colors.black : theme.colors.grey[500]
        }
      >
        {RepsDisplayOptions.map((option) => {
          return (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
}
