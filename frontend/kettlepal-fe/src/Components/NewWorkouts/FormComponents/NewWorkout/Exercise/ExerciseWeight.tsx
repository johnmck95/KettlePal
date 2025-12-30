import { FormControl, Text, FormLabel, Input, Select } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { KettlbellWeightsKG } from "../../../../../Constants/ExercisesOptions";
import { CreateWorkoutState } from "../../../../../Hooks/useCreateWorkoutForm";
import { useUser } from "../../../../../Contexts/UserContext";

interface ExerciseWeightProps {
  weightIsInvalid: boolean;
  customWeight: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  setCustomWeight: (value: boolean) => void;
  handleExercise: (name: string, value: string | number, index: number) => void;
}
export default function ExerciseWeight({
  weightIsInvalid,
  customWeight,
  exercise,
  exerciseIndex,
  setCustomWeight,
  handleExercise,
}: ExerciseWeightProps) {
  const usingBodyWeight = useUser().user?.templates?.some(
    (template) =>
      template.isBodyWeight && template.title === exercise.title.value
  );

  return (
    <FormControl isInvalid={weightIsInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Weight{" "}
        <Text
          as="span"
          fontSize={["11px", "14px"]}
          color={theme.colors.feldgrau[700]}
        >
          (x{exercise.multiplier.value.toFixed(2)})
        </Text>
      </FormLabel>
      {usingBodyWeight ? (
        <Input
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          placeholder="0"
          name="weight"
          value={exercise.weight.value}
          onChange={(event) =>
            handleExercise(event.target.name, event.target.value, exerciseIndex)
          }
          focusBorderColor={theme.colors.green[300]}
          color={
            !!exercise.weight ? theme.colors.black : theme.colors.grey[500]
          }
          disabled={usingBodyWeight}
        />
      ) : customWeight ? (
        <Input
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          placeholder="0"
          name="weight"
          value={exercise.weight.value}
          onChange={(event) =>
            handleExercise(event.target.name, event.target.value, exerciseIndex)
          }
          focusBorderColor={theme.colors.green[300]}
          color={
            !!exercise.weight ? theme.colors.black : theme.colors.grey[500]
          }
        />
      ) : (
        <Select
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          placeholder="Select"
          name="weight"
          value={exercise.weight.value}
          onChange={(event) =>
            event.target.value === "Custom"
              ? setCustomWeight(true)
              : handleExercise(
                  event.target.name,
                  event.target.value,
                  exerciseIndex
                )
          }
          focusBorderColor={theme.colors.green[300]}
          color={
            !!exercise.weight ? theme.colors.black : theme.colors.grey[500]
          }
        >
          {KettlbellWeightsKG.map((weight) => {
            return (
              <option key={weight} value={weight}>
                {weight}
              </option>
            );
          })}
        </Select>
      )}
    </FormControl>
  );
}
