import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import {
  createExerciseTitles,
  getConfigurations,
} from "../../../../../Constants/ExercisesOptions";
import { CreateWorkoutState } from "../../../../../Hooks/useCreateWorkoutForm";
import { useUser } from "../../../../../Contexts/UserContext";

interface ExerciseTitleProps {
  submitted: boolean;
  titleIsInvalid: boolean;
  customTitle: boolean;
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  exerciseIndex: number;
  setCustomTitle: (value: boolean) => void;
  handleExercise: (name: string, value: string | number, index: number) => void;
}

export default function ExerciseTitle({
  submitted,
  titleIsInvalid,
  customTitle,
  exercise,
  exerciseIndex,
  setCustomTitle,
  handleExercise,
}: ExerciseTitleProps) {
  const user = useUser().user;
  const templates = useUser().user?.templates ?? [];

  const ExerciseTitles = createExerciseTitles(templates);
  const Preconfigurations = getConfigurations(templates, {
    bodyWeight: user?.bodyWeight ?? 0,
    bodyWeightUnit: user?.bodyWeightUnit ?? "kg",
  });

  // Sets the title and preconfigured weight unit and reps display in state, if available.
  const setTitleAndPreconfigurations = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    // Set all preconfigurations based on chosen exercise title.
    handleExercise(name, value, exerciseIndex);
    handleExercise(
      "weightUnit",
      Preconfigurations[value]?.weightUnit?.value ?? "",
      exerciseIndex
    );
    handleExercise(
      "repsDisplay",
      Preconfigurations[value]?.repsDisplay?.value ?? "",
      exerciseIndex
    );
    handleExercise(
      "weight",
      Preconfigurations[value]?.weight?.value ?? "",
      exerciseIndex
    );
    handleExercise(
      "multiplier",
      Preconfigurations[value]?.multiplier?.value ?? 1.0,
      exerciseIndex
    );
  };

  return (
    <FormControl isRequired isInvalid={submitted && titleIsInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Exercise
      </FormLabel>
      {customTitle ? (
        <Input
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          placeholder="Enter Exercise"
          name="title"
          value={exercise.title}
          onChange={(event) =>
            handleExercise(event.target.name, event.target.value, exerciseIndex)
          }
          color={!!exercise.title ? theme.colors.black : theme.colors.grey[500]}
          focusBorderColor={theme.colors.green[300]}
        />
      ) : (
        <Select
          size={["sm", "sm", "md"]}
          fontSize={["16px"]}
          placeholder="Select"
          name="title"
          value={exercise.title}
          onChange={(event) =>
            event.target.value === "Custom"
              ? setCustomTitle(true)
              : setTitleAndPreconfigurations(event)
          }
          focusBorderColor={theme.colors.green[300]}
          color={!!exercise.title ? theme.colors.black : theme.colors.grey[500]}
        >
          {ExerciseTitles.map((title) => {
            return (
              <option key={title} value={title}>
                {title}
              </option>
            );
          })}
        </Select>
      )}
    </FormControl>
  );
}
