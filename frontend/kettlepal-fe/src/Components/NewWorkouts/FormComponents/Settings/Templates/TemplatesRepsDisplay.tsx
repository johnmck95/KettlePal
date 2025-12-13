import React from "react";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { RepsDisplayOptions } from "../../../../../Constants/ExercisesOptions";
import theme from "../../../../../Constants/theme";

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
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Type
      </FormLabel>
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
