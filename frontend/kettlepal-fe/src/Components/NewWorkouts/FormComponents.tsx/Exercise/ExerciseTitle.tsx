import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import theme from "../../../../Constants/theme";
import ExerciseTitles, {
  Preconfigurations,
} from "../../../../Constants/ExercisesOptions";
import { CreateWorkoutState } from "../../../../Hooks/useCreateWorkoutForm";

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
  // Sets the title and preconfigured weight unit and reps display in state, if available.
  const setTitleAndPreconfigurations = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    // Set the Title
    handleExercise(name, value, exerciseIndex);
    handleExercise(
      "weightUnit",
      Preconfigurations[value]?.weightUnit.value ?? "",
      exerciseIndex
    );
    handleExercise(
      "repsDisplay",
      Preconfigurations[value]?.repsDisplay.value ?? "",
      exerciseIndex
    );
  };

  return (
    <FormControl
      flexGrow={3}
      flexShrink={1}
      flexBasis={["50px", "90px", "160px", "180px"]}
      isRequired
      isInvalid={submitted && titleIsInvalid}
    >
      <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
        Title
      </FormLabel>
      {customTitle ? (
        <Input
          size={["sm", "sm", "md"]}
          fontSize={["12px", "14px", "16px"]}
          placeholder="Enter Title"
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
          fontSize={["12px", "14px", "16px"]}
          placeholder="Select Option"
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
