import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import theme from "../../../../Constants/theme";
import ExerciseTitles from "../../../../Constants/ExercisesOptions";
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
  return (
    <FormControl w="50%" isRequired isInvalid={submitted && titleIsInvalid}>
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
              : handleExercise(
                  event.target.name,
                  event.target.value,
                  exerciseIndex
                )
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
