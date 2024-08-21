import { Box, Text, Button, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import theme from "../Constants/theme";

/*
 * Basic implementation. This will only count the ellapsed time.
 * When a user stops the timer, DB records will not know about this, it is only for the UI.
 */
interface TimerProps {
  showStartStop: boolean;
  autoStart: boolean;
  startTime?: Date | null;
  setTime: (newTime: Date, stateName: "startTime" | "endTime") => void;
  endTime?: Date | null;
}
export default function Timer({
  showStartStop,
  autoStart,
  startTime,
  setTime,
  endTime,
}: TimerProps) {
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleStart = () => {
    setIsActive(true);
    // Ellapsed time - do not reset the initial start time.
    if (startTime === null) {
      setTime(new Date(), "startTime");
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setTime(new Date(), "endTime");
  };

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <Box w="110px" padding="0.25rem">
      <VStack w="100%" justifyContent={"flex-start"} alignItems={"flex-start"}>
        <Text textAlign="left" w="100%">
          {formatTime(timer)}
        </Text>
        <Box m="0px">
          {showStartStop && (
            <>
              {isActive ? (
                <Button
                  width="4.25rem"
                  height="1.75rem"
                  variant="stop"
                  onClick={handleStop}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  width="4.25rem"
                  height="1.75rem"
                  variant="start"
                  onClick={handleStart}
                >
                  Start
                </Button>
              )}
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
