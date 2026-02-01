import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import theme from "../Constants/theme";
import { CreateOrUpdateWorkoutState } from "../Hooks/HookHelpers/validation";
import EmomTimerInputs from "./EmomTimerInputs";
import EmomTimerClock from "./EmomTimerClock";
import { EmomConfig } from "../Hooks/useEmomTimer";

export default function EmomTimerModal({
  modalView,
  exercises,
  isOpen,
  emomConfig,
  onClose,
  onProceed,
  setModalView,
}: {
  modalView: "inputs" | "clock";
  exercises: CreateOrUpdateWorkoutState["exercises"];
  isOpen: boolean;
  emomConfig: EmomConfig;
  onClose: () => void;
  onProceed: (config: EmomConfig) => void;
  setModalView: React.Dispatch<React.SetStateAction<"inputs" | "clock">>;
}) {
  // Emom modal can be opened before exercises are defined.
  const safeExercises = Array.isArray(exercises) ? exercises : [];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
      scrollBehavior="inside"
      size="xl"
    >
      <ModalOverlay />
      <ModalContent m="1rem">
        <ModalHeader color={theme.colors.olive[500]}>EMOM Timer</ModalHeader>

        {modalView === "inputs" ? (
          <EmomTimerInputs
            exercises={safeExercises}
            onProceed={onProceed}
            onClose={onClose}
          />
        ) : (
          <EmomTimerClock
            emomConfig={emomConfig}
            exercises={safeExercises}
            setModalView={setModalView}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
