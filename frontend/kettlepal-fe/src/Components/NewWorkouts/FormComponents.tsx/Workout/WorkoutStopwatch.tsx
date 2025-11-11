import { FormLabel, VStack } from "@chakra-ui/react";
import Stopwatch, { StopwatchRef } from "../Generic/Stopwatch";
import { forwardRef } from "react";

interface WorkoutStopwatchProps {
  seconds: number;
  isActive: boolean;
  omitControls?: boolean;
  setTime: (elapsedSeconds: number) => void;
  handleIsActive: ((newState: boolean) => void) | null;
}
function WorkoutStopwatch(
  {
    seconds,
    isActive,
    omitControls = false,
    setTime,
    handleIsActive,
  }: WorkoutStopwatchProps,
  ref: React.Ref<StopwatchRef>
) {
  return (
    <VStack justifyContent={"flex-end"} alignItems={"center"}>
      <FormLabel fontSize={["sm", "lg"]} m="0px">
        <b>Elapsed Time</b>
      </FormLabel>

      <Stopwatch
        ref={ref}
        seconds={seconds}
        setTime={setTime}
        isActive={isActive}
        handleIsActive={handleIsActive}
        omitControls={omitControls}
      />
    </VStack>
  );
}

export default forwardRef(WorkoutStopwatch);
