import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import { CreateWorkoutState } from "../../../../../Hooks/useCreateWorkoutForm";
import { useUser } from "../../../../../Contexts/UserContext";

interface ExerciseWeightUnitProps {
  weightUnitIsInvalid: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseWeightUnit({
  weightUnitIsInvalid,
  exercise,
  exerciseIndex,
  handleExercise,
}: ExerciseWeightUnitProps) {
  const usingBodyWeight = useUser().user?.templates?.some(
    (template) =>
      template.isBodyWeight && template.title === exercise.title.value
  );

  return (
    <FormControl isInvalid={weightUnitIsInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Unit
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="weightUnit"
        value={exercise.weightUnit.value}
        onChange={(event) =>
          handleExercise(event.target.name, event.target.value, exerciseIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!exercise.weightUnit ? theme.colors.black : theme.colors.grey[500]
        }
        disabled={usingBodyWeight}
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
