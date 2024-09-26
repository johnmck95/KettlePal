import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { CreateWorkoutState } from "../../CreateWorkout";
import { ChangeEvent } from "react";
import theme from "../../../../Constants/theme";

interface WorkoutDateProps {
  submitted: boolean;
  state: CreateWorkoutState;
  handleStateChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function WorkoutDate({
  submitted,
  state,
  handleStateChange,
}: WorkoutDateProps) {
  return (
    <FormControl
      isRequired
      isInvalid={submitted && !state.createdAt}
      h="100%"
      display="flex"
      flexDirection="column"
      justifyContent={"flex-end"}
    >
      <FormLabel fontSize={["sm", "lg"]}>
        <b>Workout Date</b>
      </FormLabel>
      <Input
        size={["sm", "lg"]}
        name="createdAt"
        type="date"
        bg="white"
        maxW="180px"
        value={state.createdAt}
        onChange={handleStateChange}
        border="1px solid grey"
        borderRadius={"5px"}
        m="0"
        focusBorderColor={theme.colors.green[300]}
      />
    </FormControl>
  );
}
