import React from "react";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { RepsDisplayOptions } from "../../../../../Constants/ExercisesOptions";
import theme from "../../../../../Constants/theme";

interface TemplatesTitleProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  handleTemplate: (name: string, value: string | number, index: number) => void;
}

export default function TemplatesRepsDisplay({
  template,
  templateIndex,
  handleTemplate,
}: TemplatesTitleProps) {
  return (
    <FormControl
    // isInvalid={submitted && repsDisplayIsInvalid}
    >
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Type
      </FormLabel>
      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        placeholder="Select"
        name="repsDisplay"
        value={template.repsDisplay}
        onChange={(event) =>
          handleTemplate(event.target.name, event.target.value, templateIndex)
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
