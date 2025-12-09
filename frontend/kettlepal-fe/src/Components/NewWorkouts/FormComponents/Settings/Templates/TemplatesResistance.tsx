import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { ResistanceOptions } from "../../../../../Constants/ExercisesOptions";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";

interface TemplatesResistanceProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  handleTemplate: (
    name: string,
    value: string | number | boolean,
    index: number
  ) => void;
}

export default function TemplatesResistance({
  template,
  templateIndex,
  handleTemplate,
}: TemplatesResistanceProps) {
  return (
    <FormControl
      isRequired
      // isInvalid={submitted && weightUnitIsInvalid}
    >
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Resistance
      </FormLabel>

      <Select
        fontSize={["16px"]}
        size={["sm", "sm", "md"]}
        name="isBodyWeight"
        value={template.isBodyWeight ? "bodyWeight" : "weighted"}
        onChange={(event) =>
          handleTemplate(
            "isBodyWeight",
            event.target.value === "bodyWeight" ? true : false,
            templateIndex
          )
        }
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
