import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import { ChangeEvent } from "react";

interface BodyWeightUnitSettingsProps {
  state: EditSettingsState;
  handleStateChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function BodyWeightUnitSettings({
  state,
  handleStateChange,
}: BodyWeightUnitSettingsProps) {
  return (
    <FormControl
      maxW="105px"
      // isInvalid={submitted && weightUnitIsInvalid}
    >
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Unit
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="bodyWeightUnit"
        value={state.bodyWeightUnit}
        onChange={(event) => handleStateChange(event)}
        focusBorderColor={theme.colors.green[300]}
        color={
          !!state.bodyWeightUnit ? theme.colors.black : theme.colors.grey[500]
        }
        bg={theme.colors.white}
        borderRadius={"5px"}
      >
        {WeightOptions.map((option) => {
          return (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
}
