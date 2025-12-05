import { Button, VStack } from "@chakra-ui/react";
import React from "react";
import { SettingsState } from "../../Pages/Settings";

interface EditSettingsProps {
  state: SettingsState;
  handleState: React.Dispatch<React.SetStateAction<SettingsState>>;
}

export default function EditSettings({
  state,
  handleState,
}: EditSettingsProps) {
  return (
    <VStack>
      <Button
        onClick={() => handleState((prev) => ({ ...prev, edit: !prev.edit }))}
      >
        View Settings
      </Button>
      <h1>Edit Settings Component</h1>;
    </VStack>
  );
}
