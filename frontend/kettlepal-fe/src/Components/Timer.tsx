import { Text, Button, Box, Stack, useDisclosure } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import theme from "../Constants/theme";
import ConfirmModal from "./ConfirmModal";

interface TimerProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  setTime: (elapsedSeconds: number) => void;
}

// BUG: when you "hide details" or "See details" of a workout, 'seconds' is reset.
export default function Timer({ isActive, setIsActive, setTime }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  function startOrResume() {
    setIsActive(true);
    setTime(seconds);
  }

  function onReset() {
    setSeconds(0);
    setIsActive(false);
    onClose();
    setTime(0);
  }

  function pause() {
    setIsActive(false);
    setTime(seconds);
  }

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    if (getHours === "00") {
      return `${getMinutes}:${getSeconds}`;
    } else {
      return `${getHours}:${getMinutes}:${getSeconds}`;
    }
  };

  // Every 1s, update the elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack
      direction={["row", "column"]}
      justifyContent={"center"}
      alignItems="center"
    >
      <Box position="relative" width="60px" height="60px">
        {/* Background Circle */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          borderRadius="50%"
          bg={theme.colors.feldgrau[100]}
        />

        {/* Inner "Donut" of the Timer */}
        <Box
          position="absolute"
          top="10%"
          left="10%"
          width="80%"
          height="80%"
          zIndex={2}
          borderRadius="50%"
          bg="rgba(250,249,246,1)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            textAlign="center"
            w="100%"
            m="0"
            p="0"
            fontSize={seconds > 3600 ? "8px" : "xs"}
          >
            <b>{formatTime(seconds)}</b>
          </Text>
        </Box>

        {/* Progress Circle */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          borderRadius="50%"
          sx={{
            background: `conic-gradient(${theme.colors.green[500]} ${
              (seconds % 60) * 6
            }deg, transparent ${(seconds % 60) * 6}deg)`,
          }}
        />
      </Box>
      <Stack direction={["column", "row"]}>
        <Button size="xs" onClick={onOpen} variant="secondary" w="60px">
          Reset
        </Button>
        <Button
          size="xs"
          variant="primary"
          onClick={isActive ? pause : startOrResume}
          w="60px"
        >
          {isActive ? "Pause" : seconds === 0 ? "Start" : "Resume"}
        </Button>
      </Stack>

      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirmation={onReset}
        ModalTitle="Reset Timer"
        ModalBodyText="Are you sure you would like to Reset the timer? This cannot be undone."
        CloseText="Cancel"
        ProceedText="Reset"
        variant="warn"
      />
    </Stack>
  );
}
