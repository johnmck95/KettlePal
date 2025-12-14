import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import { ChangeEvent } from "react";

interface BodyWeightUnitSettingsProps {
  state: EditSettingsState;
  isInvalid: boolean;
  handleStateChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleTemplate: (
    name: TemplateEditableField,
    value: string | number | boolean,
    index: number
  ) => void;
}

export default function BodyWeightUnitSettings({
  state,
  isInvalid,
  handleStateChange,
  handleTemplate,
}: BodyWeightUnitSettingsProps) {
  // When users body weight changes, we need to update the weightUnit for all body weight templates
  function updateState(event: ChangeEvent<HTMLSelectElement>) {
    handleStateChange(event);
    state.templates.forEach((template, index) => {
      if (template.isBodyWeight.value) {
        handleTemplate("weightUnit", event.target.value, index);
      }
    });
  }

  return (
    <FormControl maxW="105px" isInvalid={isInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Unit
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        name="bodyWeightUnit"
        value={state.bodyWeightUnit.value}
        onChange={(event) => updateState(event)}
        focusBorderColor={theme.colors.green[300]}
        color={
          state.bodyWeightUnit.value !== ""
            ? theme.colors.black
            : theme.colors.grey[500]
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
