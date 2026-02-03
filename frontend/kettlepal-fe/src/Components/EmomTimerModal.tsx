import { useEffect, useMemo, useState } from "react";
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
import EmomStartDelay from "./EmomStartDelay";
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
  const safeExercises = Array.isArray(exercises) ? exercises : [];
  const [phase, setPhase] = useState<"delay" | "running">("delay");

  useEffect(() => {
    if (modalView === "clock") {
      setPhase(emomConfig.startDelaySeconds > 0 ? "delay" : "running");
    }
  }, [modalView, emomConfig.startDelaySeconds]);

  const linkedExercises = useMemo(() => {
    if (emomConfig.mode === "manual") {
      return [];
    }
    return safeExercises.filter((e) =>
      emomConfig.exerciseKeys?.includes(e.key ?? "")
    );
  }, [emomConfig, safeExercises]);

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
        ) : phase === "delay" ? (
          <EmomStartDelay
            seconds={emomConfig.startDelaySeconds}
            onComplete={() => setPhase("running")}
            firstExercise={linkedExercises[0]}
            onReset={() => setModalView("inputs")}
          />
        ) : (
          <EmomTimerClock
            emomConfig={emomConfig}
            linkedExercises={linkedExercises}
            setModalView={setModalView}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
