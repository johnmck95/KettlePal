import { FormLabel, VStack } from "@chakra-ui/react";
import Timer from "../Generic/Timer";
import { CreateWorkoutState } from "../../CreateWorkout";

interface ExerciseTimerProps {
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  timerIsActive: boolean;
  handleTimerIsActive: ((newState: boolean) => void) | null;
  setTime: (time: number) => void;
}
export default function ExerciseTimer({
  exercise,
  timerIsActive,
  handleTimerIsActive,
  setTime,
}: ExerciseTimerProps) {
  return (
    <VStack alignItems={"flex-start"} minWidth="130px" spacing={0}>
      <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
        Elapsed Time
      </FormLabel>
      <Timer
        seconds={exercise.elapsedSeconds}
        isActive={timerIsActive}
        handleIsActive={handleTimerIsActive}
        setTime={setTime}
        size="sm"
        variant="digital"
      />
    </VStack>
  );
}
