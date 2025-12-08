import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";

interface TemplatesWeightUnitProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  handleTemplate: (name: string, value: string | number, index: number) => void;
}

export default function TemplatesWeightUnit({
  template,
  templateIndex,
  handleTemplate,
}: TemplatesWeightUnitProps) {
  return (
    <FormControl
    // isInvalid={submitted && weightUnitIsInvalid}
    >
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Unit
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="weightUnit"
        value={template.weightUnit}
        onChange={(event) =>
          handleTemplate(event.target.name, event.target.value, templateIndex)
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
