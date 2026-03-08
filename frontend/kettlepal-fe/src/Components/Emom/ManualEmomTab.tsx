import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
  VStack,
} from "@chakra-ui/react";
import theme from "../../Constants/theme";

export function ManualEmomTab({
  rounds,
  onChange,
}: {
  rounds: number;
  onChange: (rounds: number) => void;
}) {
  return (
    <VStack align="stretch" spacing={4}>
      <FormControl>
        <FormLabel>Rounds</FormLabel>

        <NumberInput
          min={1}
          value={rounds}
          onChange={(_, valueAsNumber) =>
            onChange(isNaN(valueAsNumber) ? 0 : valueAsNumber)
          }
          focusBorderColor={theme.colors.green[300]}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormHelperText>Each round is one minute.</FormHelperText>
      </FormControl>
    </VStack>
  );
}
