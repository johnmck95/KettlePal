import { FormLabel, VStack } from "@chakra-ui/react";
import Stopwatch from "../Generic/Stopwatch";

interface WorkoutStopwatchProps {
  seconds: number;
  isActive: boolean;
  omitControls?: boolean;
  setTime: (elapsedSeconds: number) => void;
  handleIsActive: ((newState: boolean) => void) | null;
}
export default function WorkoutStopwatch({
  seconds,
  isActive,
  omitControls = false,
  setTime,
  handleIsActive,
}: WorkoutStopwatchProps) {
  return (
    <VStack justifyContent={"flex-end"} alignItems={"center"}>
      <FormLabel fontSize={["sm", "lg"]} m="0px">
        <b>Elapsed Time</b>
      </FormLabel>
      <Stopwatch
        seconds={seconds}
        setTime={setTime}
        isActive={isActive}
        handleIsActive={handleIsActive}
        omitControls={omitControls}
      />
    </VStack>
  );
}
