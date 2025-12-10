import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { EditSettingsState } from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";

interface TemplatesMultiplierProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  handleTemplate: (name: string, value: string | number, index: number) => void;
}

export default function TemplatesMultiplier({
  template,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesMultiplierProps) {
  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormLabel fontSize={["14px", "16px"]} m="0">
        Multiplier
      </FormLabel>
      <Input
        size={["sm", "sm", "md"]}
        fontSize={["16px"]}
        placeholder="0"
        padding="0.5rem"
        autoComplete="off"
        type="number"
        name="multiplier"
        value={template.multiplier}
        onChange={(event) =>
          handleTemplate("multiplier", event.target.value, templateIndex)
        }
        focusBorderColor={theme.colors.green[300]}
        color={
          !!template.multiplier ? theme.colors.black : theme.colors.grey[500]
        }
      />
    </FormControl>
  );
}
