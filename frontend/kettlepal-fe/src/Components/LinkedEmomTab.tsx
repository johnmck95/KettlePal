import {
  Checkbox,
  VStack,
  Text,
  Divider,
  Box,
  FormControl,
} from "@chakra-ui/react";
import { CreateOrUpdateWorkoutState } from "../Hooks/HookHelpers/validation";
import { formatExerciseString } from "../utils/Exercises/exercises";
import theme from "../Constants/theme";

export function LinkedEmomTab({
  exercises,
  selectedExerciseKeys,
  onChange,
}: {
  exercises: CreateOrUpdateWorkoutState["exercises"];
  selectedExerciseKeys: string[];
  onChange: (keys: string[]) => void;
}) {
  const toggleExercise = (key: string) => {
    onChange(
      selectedExerciseKeys.includes(key)
        ? selectedExerciseKeys.filter((k) => k !== key)
        : [...selectedExerciseKeys, key]
    );
  };

  const totalRounds = exercises
    .filter((e) => selectedExerciseKeys.includes(e.key as string))
    .reduce((sum, e) => sum + (Number(e.sets.value) || 0), 0);

  return (
    <FormControl>
      <VStack align="stretch" spacing={3}>
        <Text fontWeight="medium">Rounds</Text>
        <VStack align="stretch" spacing={2}>
          {exercises.map((exercise) => (
            <Checkbox
              key={exercise.key}
              isChecked={selectedExerciseKeys.includes(exercise.key as string)}
              onChange={() => toggleExercise(exercise.key as string)}
              colorScheme="feldgrau"
            >
              {formatExerciseString({
                title: exercise.title.value,
                weight: exercise.weight.value,
                weightUnit: exercise.weightUnit.value,
                sets: exercise.sets.value,
                reps: exercise.reps.value,
                repsDisplay: exercise.repsDisplay.value,
                comment: exercise.comment.value,
              }) || "----"}
            </Checkbox>
          ))}
        </VStack>

        <Divider />

        <Box>
          <Text fontSize="md" color={theme.colors.gray[700]}>
            Total Rounds: <b>{totalRounds}</b>
          </Text>
        </Box>
      </VStack>
    </FormControl>
  );
}
