import { FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import { ChangeEvent } from "react";
import ToolTip from "../../../../UI/ToolTip";

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
      <HStack>
        <FormLabel fontSize={["14px", "16px"]} m="0">
          Body Weight
        </FormLabel>
        <ToolTip message="Body Weight is strictly used to calculate work capacity of body weight exercises. Body Weight is not required, but if you chose to omit it, KettlePal cannot compute work capacity for body weight exercises. " />
      </HStack>

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
