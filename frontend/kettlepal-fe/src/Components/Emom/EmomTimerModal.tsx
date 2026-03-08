import { useEffect, useMemo, useState } from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { CreateOrUpdateWorkoutState } from "../../Hooks/HookHelpers/validation";
import EmomTimerInputs from "./EmomTimerInputs";
import EmomTimerClock from "./EmomTimerClock";
import EmomStartDelay from "./EmomStartDelay";
import { EmomConfig } from "../../Hooks/useEmomTimer";
import { buildEmomSchedule } from "../../utils/Emom/emom";

export default function EmomTimerModal({
  modalView,
  exercises,
  isOpen,
  emomConfig,
  onClose,
  onProceed,
  setModalView,
  completedASet,
}: {
  modalView: "inputs" | "clock";
  exercises: CreateOrUpdateWorkoutState["exercises"];
  isOpen: boolean;
  emomConfig: EmomConfig;
  onClose: () => void;
  onProceed: (config: EmomConfig) => void;
  setModalView: React.Dispatch<React.SetStateAction<"inputs" | "clock">>;
  completedASet: (exerciseKey: string) => void;
}) {
  const [phase, setPhase] = useState<"delay" | "running">("delay");
  const safeExercises = useMemo(
    () => (Array.isArray(exercises) ? exercises : []),
    [exercises]
  );

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

  const emomSchedule = useMemo(() => {
    if (emomConfig.mode === "manual") return [];
    return buildEmomSchedule(linkedExercises);
  }, [linkedExercises, emomConfig.mode]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="min(1080px, calc(100vw - 2rem))"
        maxH="min(900px, calc(100vh - 2rem))"
        h="100%"
        borderRadius="xl"
        overflow="hidden"
        justifyContent={"center"}
        alignItems={"center"}
        px={["0rem 0rem 2rem"]}
      >
        <Box maxW="720px" w="100%" h="100%">
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
              firstExercise={emomSchedule[0]}
              onReset={() => setModalView("inputs")}
            />
          ) : (
            <EmomTimerClock
              emomConfig={emomConfig}
              schedule={emomSchedule}
              setModalView={setModalView}
              onClose={onClose}
              completedASet={completedASet}
            />
          )}
        </Box>
      </ModalContent>
    </Modal>
  );
}
