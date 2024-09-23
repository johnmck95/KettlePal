import { Text, Button, Box, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import theme from "../Constants/theme";
import ConfirmModal from "./ConfirmModal";

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

function Analog({ size, seconds }: { size: "sm" | "md"; seconds: number }) {
  return (
    <Box
      position="relative"
      width={size === "sm" ? "50px" : "60px"}
      height={size === "sm" ? "50px" : "60px"}
    >
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
          fontSize={
            size === "sm"
              ? seconds >= 3600
                ? "7px"
                : "10px"
              : seconds >= 3600
              ? "9px"
              : "sm"
          }
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
  );
}

function Digital({ seconds }: { seconds: number }) {
  return (
    <Text
      border={`1px solid ${theme.colors.gray[200]}`}
      borderRadius={["2px", "3px", "6px"]}
      w="70px"
      h={["32px", "40px"]}
      textAlign="center"
      fontSize="xs"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {formatTime(seconds)}
    </Text>
  );
}

interface TimerProps {
  seconds: number;
  isActive: boolean;
  handleIsActive: (value: boolean) => void;
  setTime: (elapsedSeconds: number) => void;
  size?: "sm" | "md";
  variant?: "analog" | "digital";
}

// NOTE: The parent component is responsible for setting the interval.
// This enables the timer to continue working even when removed from the DOM.
export default function Timer({
  seconds,
  isActive,
  handleIsActive,
  setTime,
  size = "md",
  variant = "analog",
}: TimerProps) {
  function startOrResume() {
    handleIsActive(true);
    setTime(seconds);
  }

  function onReset() {
    handleIsActive(false);
    onClose();
    setTime(0);
  }

  function pause() {
    handleIsActive(false);
    setTime(seconds);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack
      direction={"row"}
      w="100%"
      justifyContent={"space-between"}
      alignItems="flex-end"
    >
      {variant === "digital" ? (
        <Digital seconds={seconds} />
      ) : (
        <Analog size={size} seconds={seconds} />
      )}
      <Stack direction={"column"} spacing={1}>
        <Button
          w="55px"
          h="20px"
          fontSize="12px"
          onClick={onOpen}
          variant="secondary"
        >
          Reset
        </Button>
        <Button
          w="55px"
          h="20px"
          fontSize="12px"
          variant="primary"
          onClick={isActive ? pause : startOrResume}
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
