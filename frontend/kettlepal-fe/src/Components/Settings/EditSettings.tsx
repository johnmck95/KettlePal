import { Button, VStack } from "@chakra-ui/react";
import React from "react";

interface EditSettingsProps {
  toggleEditMode: () => void;
}

export default function EditSettings({ toggleEditMode }: EditSettingsProps) {
  return (
    <VStack>
      <Button onClick={toggleEditMode}>View Settings</Button>
      <h1>Edit Settings Component</h1>;
    </VStack>
  );
}
