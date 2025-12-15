import { FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import React from "react";
import theme from "../../../../../Constants/theme";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import { capitalizeWords } from "../../../../../utils/textFormatters";
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

export default function TemplatesTitle({
  template,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesTitleProps) {
  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <HStack>
        <FormLabel fontSize={["14px", "16px"]} m="0">
          Exercise
        </FormLabel>
        <ToolTip message="The name of the exercise." />
      </HStack>
      <Input
        size={["sm", "sm", "md"]}
        fontSize={["16px"]}
        placeholder="Exercise Title"
        name="title"
        value={template.title.value}
        onChange={(event) => {
          const capitalizedValue = capitalizeWords(event.target.value);
          handleTemplate("title", capitalizedValue, templateIndex);
        }}
        color={!!template.title ? theme.colors.black : theme.colors.grey[500]}
        focusBorderColor={theme.colors.green[300]}
      />
    </FormControl>
  );
}
