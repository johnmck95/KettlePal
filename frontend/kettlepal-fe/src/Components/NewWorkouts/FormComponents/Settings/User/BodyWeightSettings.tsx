import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import { ChangeEvent } from "react";

interface BodyWeightSettingsProps {
  state: EditSettingsState;
  isInvalid: boolean;
  handleStateChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function BodyWeightSettings({
  state,
  isInvalid,
  handleStateChange,
}: BodyWeightSettingsProps) {
  return (
    <FormControl maxW="150px" isInvalid={isInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Body Weight
      </FormLabel>
      <Input
        size={["sm", "sm", "md"]}
        fontSize={["16px"]}
        placeholder="0"
        padding="0.5rem"
        autoComplete="off"
        type="number"
        name="bodyWeight"
        value={state.bodyWeight.value}
        onChange={(event) => handleStateChange(event)}
        focusBorderColor={theme.colors.green[300]}
        color={
          state.bodyWeight.value !== ""
            ? theme.colors.black
            : theme.colors.grey[500]
        }
        bg={theme.colors.white}
        borderRadius={"5px"}
      />
    </FormControl>
  );
}
