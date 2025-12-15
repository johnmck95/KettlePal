import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import theme from "../../../../../Constants/theme";

interface WorkoutDateProps {
  submitted: boolean;
  date: string;
  handleStateChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function WorkoutDate({
  submitted,
  date,
  handleStateChange,
}: WorkoutDateProps) {
  return (
    <FormControl
      isRequired
      isInvalid={submitted && !date}
      h="100%"
      display="flex"
      flexDirection="column"
      justifyContent={"flex-end"}
      w="100%"
      maxWidth="200px"
    >
      <FormLabel fontSize={["sm", "lg"]}>
        <b>Workout Date</b>
      </FormLabel>
      <Input
        size={["sm", "lg"]}
        name="date"
        type="date"
        bg="white"
        maxW="200px"
        value={date}
        onChange={handleStateChange}
        border="1px solid grey"
        borderRadius={"5px"}
        m="0"
        focusBorderColor={theme.colors.green[300]}
      />
    </FormControl>
  );
}
