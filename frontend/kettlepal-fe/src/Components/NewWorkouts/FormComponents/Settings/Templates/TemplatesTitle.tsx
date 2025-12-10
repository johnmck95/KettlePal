import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import theme from "../../../../../Constants/theme";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import { capitalizeWords } from "../../../../../utils/textFormatters";

interface TemplatesTitleProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  handleTemplate: (name: string, value: string | number, index: number) => void;
}

export default function TemplatesTitle({
  template,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesTitleProps) {
  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Exercise
      </FormLabel>
      <Input
        size={["sm", "sm", "md"]}
        fontSize={["16px"]}
        placeholder="Exercise Title"
        name="title"
        value={template.title}
        onChange={(event) => {
          const capitalizedValue = capitalizeWords(event.target.value);
          handleTemplate(event.target.name, capitalizedValue, templateIndex);
        }}
        color={!!template.title ? theme.colors.black : theme.colors.grey[500]}
        focusBorderColor={theme.colors.green[300]}
      />
    </FormControl>
  );
}
