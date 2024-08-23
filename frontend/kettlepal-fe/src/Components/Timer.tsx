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
  showAsError?: boolean;
  timerIsActive: boolean;
  setTimerIsActive: (isActive: boolean) => void;
}
export default function Timer({
  showStartStop,
  autoStart,
  startTime,
  setTime,
  showAsError,
  timerIsActive,
  setTimerIsActive,
}: TimerProps) {
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (timerIsActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!timerIsActive && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerIsActive, timer]);

  const handleStart = () => {
    setTimerIsActive(true);
    // Ellapsed time - do not reset the initial start time.
    if (startTime === null) {
      setTime(new Date(), "startTime");
    }
  };

  const handleStop = () => {
    setTimerIsActive(false);
    setTime(new Date(), "endTime");
  };

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, []);

  return (
    <VStack w="110px" h="100%" justifyContent={"space-between"}>
      <Text textAlign="left" w="100%" m="0" p="0">
        <b>{formatTime(timer)}</b>
      </Text>
      <Box>
        {showStartStop && (
          <>
            {timerIsActive ? (
              <Button
                width="4.25rem"
                height="2rem"
                variant="secondary"
                onClick={handleStop}
                color={theme.colors.grey[700]}
                border={
                  showAsError
                    ? `1px solid ${theme.colors.error}`
                    : `1px solid ${theme.colors.grey[500]}`
                }
              >
                Stop
              </Button>
            ) : (
              <Button
                width="4.25rem"
                height="2rem"
                variant={"secondary"}
                onClick={handleStart}
              >
                Start
              </Button>
            )}
          </>
        )}
      </Box>
    </VStack>
  );
}
