import { FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../../../../Hooks/useEditSettings";
import theme from "../../../../../Constants/theme";
import ToolTip from "../../../../UI/ToolTip";

interface TemplatesMultiplierProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  isInvalid: boolean;
  handleTemplate: (
    name: TemplateEditableField,
    value: string | number,
    index: number
  ) => void;
}

export default function TemplatesMultiplier({
  template,
  templateIndex,
  isInvalid,
  handleTemplate,
}: TemplatesMultiplierProps) {
  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <HStack>
        <FormLabel fontSize={["14px", "16px"]} m="0">
          Multiplier
        </FormLabel>
        <ToolTip message="Multipliers allow you to tailor the work capacity of an exercise. A Pull Up moves roughly 0.95 times your body weight, so setting the multiplier to 0.95 is appropriate. Work Capacity = Sets x Reps x Weight x Multiplier. You can also use a multiplier to account for compound movements. For example, you may want to log a Clean & Press rep with 2x the Work Capacity as a Should Press rep, so you would set the multiplier of the Clean & Press template to 2, and the multiplier of the Shoulder Press template to 1." />
      </HStack>

      <Input
        size={["sm", "sm", "md"]}
        fontSize={["16px"]}
        placeholder="0"
        padding="0.5rem"
        autoComplete="off"
        type="number"
        name="multiplier"
        value={template.multiplier.value}
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
