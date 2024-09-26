import { FormLabel, VStack } from "@chakra-ui/react";
import Timer from "../Generic/Timer";
import { CreateWorkoutState } from "../../CreateWorkout";

interface WorkoutTimerProps {
  state: CreateWorkoutState;
  timerIsActive: boolean;
  handleTimerIsActive: (newState: boolean) => void;
  setTime: (elapsedSeconds: number) => void;
}
export default function WorkoutTimer({
  state,
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
        seconds={state.elapsedSeconds}
        isActive={timerIsActive}
        handleIsActive={handleTimerIsActive}
        setTime={setTime}
        size="md"
      />
    </VStack>
  );
}
