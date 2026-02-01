import { useDisclosure } from "@chakra-ui/react";
import { CreateOrUpdateWorkoutState } from "./HookHelpers/validation";
import { useState } from "react";

export type EmomConfig =
  | {
      mode: "manual";
      rounds: number;
      startDelaySeconds: number;
    }
  | {
      mode: "linked";
      exerciseKeys: string[];
      rounds: number;
      startDelaySeconds: number;
    };

const useEmomTimer = ({
  exercises,
}: {
  exercises: CreateOrUpdateWorkoutState["exercises"];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [emomConfig, setEmomConfig] = useState<EmomConfig>({
    mode: "manual",
    rounds: 0,
    startDelaySeconds: 10,
  });
  const [modalView, setModalView] = useState<"inputs" | "clock">("inputs");

  // After the user defines the EMOM config in the modal and clicks 'Proceed'
  function onProceed(emomConfig: EmomConfig) {
    setEmomConfig(emomConfig);
    setModalView("clock");
  }

  return {
    modalView,
    emomConfig,
    isOpen,
    onOpen,
    onClose,
    onProceed,
    setModalView,
  };
};

export default useEmomTimer;
