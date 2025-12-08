import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import { CreateWorkoutState } from "../../../../../Hooks/useCreateWorkoutForm";

interface ExerciseWeightUnitProps {
  submitted: boolean;
  weightUnitIsInvalid: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseWeightUnit({
  submitted,
  weightUnitIsInvalid,
  exercise,
  exerciseIndex,

  handleExercise,
}: ExerciseWeightUnitProps) {
  return (
    <FormControl isInvalid={submitted && weightUnitIsInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Unit
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="weightUnit"
        value={exercise.weightUnit}
        onChange={(event) =>
          handleExercise(event.target.name, event.target.value, exerciseIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!exercise.weightUnit ? theme.colors.black : theme.colors.grey[500]
        }
      >
        {WeightOptions.map((option) => {
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
