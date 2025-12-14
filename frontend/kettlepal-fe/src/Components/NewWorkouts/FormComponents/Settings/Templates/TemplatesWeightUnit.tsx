import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";

interface TemplatesWeightUnitProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  handleTemplate: (
    name: TemplateEditableField,
    value: string | number,
    index: number
  ) => void;
}

export default function TemplatesWeightUnit({
  template,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesWeightUnitProps) {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Unit
      </FormLabel>
      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        name="weightUnit"
        value={template.weightUnit.value}
        onChange={(event) =>
          handleTemplate("weightUnit", event.target.value, templateIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!template.weightUnit ? theme.colors.black : theme.colors.grey[500]
        }
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
