import React from "react";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import { FormControl, FormLabel, HStack, Select } from "@chakra-ui/react";
import { RepsDisplayOptions } from "../../../../../Constants/ExercisesOptions";
import theme from "../../../../../Constants/theme";
import ToolTip from "../../../../UI/ToolTip";

interface TemplatesTitleProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  handleTemplate: (
    name: TemplateEditableField,
    value: string | number,
    index: number
  ) => void;
}

export default function TemplatesRepsDisplay({
  template,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesTitleProps) {
  return (
    <FormControl isInvalid={isInvalid}>
      <HStack>
        <FormLabel fontSize={["14px", "16px"]} m="0">
          Type
        </FormLabel>
        <ToolTip
          message={`"Standard" exercises are completed once per rep, like a Swing, Pull Up or Goblet Squat. "Left / Right" exercises are completed on the left side and the right side, like Pistol Squats, or Single-Arm Swings (10 pistol squats is 5 on the left leg and 5 on the right leg). The remaining types are Ladders, which use an ascending/descending rep scheme.`}
        />
      </HStack>
      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="repsDisplay"
        value={template.repsDisplay.value}
        onChange={(event) =>
          handleTemplate("repsDisplay", event.target.value, templateIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!template.repsDisplay ? theme.colors.black : theme.colors.grey[500]
        }
      >
        {RepsDisplayOptions.map((option) => {
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
