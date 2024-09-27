import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import theme from "../../../../Constants/theme";

interface WorkoutDateProps {
  submitted: boolean;
  createdAt: string;
  handleStateChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function WorkoutDate({
  submitted,
  createdAt,
  handleStateChange,
}: WorkoutDateProps) {
  return (
    <FormControl
      isRequired
      isInvalid={submitted && !createdAt}
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
        value={createdAt}
        onChange={handleStateChange}
        border="1px solid grey"
        borderRadius={"5px"}
        m="0"
        focusBorderColor={theme.colors.green[300]}
      />
    </FormControl>
  );
}
