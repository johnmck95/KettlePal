import { FormControl, FormLabel, HStack, Select } from "@chakra-ui/react";
import { WeightOptions } from "../../../../../Constants/ExercisesOptions";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";
import ToolTip from "../../../../UI/ToolTip";

interface TemplatesWeightUnitProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  isBodyWeight: boolean;
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
  isBodyWeight,
  handleTemplate,
}: TemplatesWeightUnitProps) {
  return (
    <FormControl isInvalid={isInvalid}>
      <HStack>
        <FormLabel fontSize={["14px", "16px"]} m="0">
          Unit
        </FormLabel>
        <ToolTip message="The preferred unit for the exercise. Body Weight Unit will be automatically referenced when Resistance is set to Body Weight. " />
      </HStack>
      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="weightUnit"
        value={template.weightUnit.value}
        onChange={(event) =>
          handleTemplate("weightUnit", event.target.value, templateIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!template.weightUnit.value
            ? theme.colors.black
            : theme.colors.grey[500]
        }
        isDisabled={isBodyWeight}
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
