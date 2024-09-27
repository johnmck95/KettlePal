import { FormLabel, VStack } from "@chakra-ui/react";
import Timer from "../Generic/Timer";

interface WorkoutTimerProps {
  elapsedSeconds: number;
  timerIsActive: boolean;
  handleTimerIsActive: ((newState: boolean) => void) | null;
  setTime: (elapsedSeconds: number) => void;
}
export default function WorkoutTimer({
  elapsedSeconds,
  timerIsActive,
  handleTimerIsActive,
  setTime,
}: WorkoutTimerProps) {
  return (
    <VStack justifyContent={"flex-end"} alignItems={"center"}>
      <FormLabel fontSize={["sm", "lg"]} m="0px">
        <b>Elapsed Time</b>
      </FormLabel>
      <Timer
        seconds={elapsedSeconds}
        isActive={timerIsActive}
        handleIsActive={handleTimerIsActive}
        setTime={setTime}
        size="md"
      />
    </VStack>
  );
}
