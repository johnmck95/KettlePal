import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { ResistanceOptions } from "../../../../../Constants/ExercisesOptions";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";

interface TemplatesResistanceProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  bodyWeightUnit: "kg" | "lb";
  handleTemplate: (
    name: TemplateEditableField,
    value: string | number | boolean,
    index: number
  ) => void;
}

export default function TemplatesResistance({
  template,
  bodyWeightUnit,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesResistanceProps) {
  function handleResistanceState(event: React.ChangeEvent<HTMLSelectElement>) {
    handleTemplate(
      "isBodyWeight",
      event.target.value === "bodyWeight" ? true : false,
      templateIndex
    );
    // If switching to bodyWeight, load the users bodyWeightUnit
    if (event.target.value === "bodyWeight") {
      handleTemplate("weightUnit", bodyWeightUnit, templateIndex);
    }
  }

  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Resistance
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        name="isBodyWeight"
        value={template.isBodyWeight.value ? "bodyWeight" : "weighted"}
        onChange={(event) => handleResistanceState(event)}
        focusBorderColor={theme.colors.green[300]}
        color={theme.colors.black}
      >
        {ResistanceOptions.map((option) => {
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
