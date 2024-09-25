import {
  Text,
  Button,
  Box,
  Stack,
  useDisclosure,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import React from "react";
import theme from "../Constants/theme";
import ConfirmModal from "./ConfirmModal";
import {
  computeSeconds,
  formatTime,
  formatTimeInput,
} from "../utils/Time/time";

function EditableTimerText({
  fontSize,
  seconds,
  updateTo,
  setUpdateTo,
  setTime,
  pause,
}: {
  fontSize: string;
  seconds: number;
  updateTo: string;
  setUpdateTo: (value: string) => void;
  setTime: (elapsedSeconds: number) => void;
  pause: () => void;
}) {
  const [beingEdited, setBeingEdited] = React.useState(false);

  const handleChange = (value: string) => {
    let formattedValue = formatTimeInput(value);
    setUpdateTo(value);
    setTime(computeSeconds(formattedValue));
  };

  function handleClick() {
    setBeingEdited(true);
    pause();
    setUpdateTo(formatTime(seconds));
  }

  // Update state when the user clicks outside the input or finishes editing
  const handleBlur = () => {
    setBeingEdited(false);

    const formattedValue = formatTimeInput(updateTo);
    setUpdateTo(formattedValue);
    setTime(computeSeconds(formattedValue));
  };
  return (
    <Editable
      value={beingEdited ? updateTo : formatTime(seconds)}
      color={beingEdited ? theme.colors.gray[500] : theme.colors.black}
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={handleClick}
      placeholder={"00:00"}
      textAlign="center"
      w="100%"
      fontFamily="monospace"
      m="0"
      p="0"
      fontSize={fontSize}
    >
      <EditablePreview
        w="100%"
        sx={{
          color: true ? theme.colors.black : theme.colors.gray[500],
        }}
      />
      <EditableInput
        w="100%"
        sx={{
          _placeholder: { color: theme.colors.gray[500] },
        }}
      />
    </Editable>
  );
}

function Analog({
  size,
  seconds,
  updateTo,
  setUpdateTo,
  setTime,
  pause,
}: {
  size: "sm" | "md";
  seconds: number;
  updateTo: string;
  setUpdateTo: (value: string) => void;
  setTime: (elapsedSeconds: number) => void;
  pause: () => void;
}) {
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
        bg="white"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <EditableTimerText
          seconds={seconds}
          updateTo={updateTo}
          setUpdateTo={setUpdateTo}
          setTime={setTime}
          pause={pause}
          fontSize={
            size === "sm"
              ? seconds >= 3600
                ? "7px"
                : "10px"
              : seconds >= 3600
              ? "9px"
              : "sm"
          }
        />
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

function Digital({
  size,
  seconds,
  updateTo,
  setUpdateTo,
  setTime,
  pause,
}: {
  size: "sm" | "md";
  seconds: number;
  updateTo: string;
  setUpdateTo: (value: string) => void;
  setTime: (elapsedSeconds: number) => void;
  pause: () => void;
}) {
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
      <EditableTimerText
        fontSize={"11px"}
        seconds={seconds}
        updateTo={updateTo}
        setUpdateTo={setUpdateTo}
        setTime={setTime}
        pause={pause}
      />
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
  // updateTo is an unformatted user-input string. It's a temporary
  // variable before formatting and saving to the form state.
  const [updateTo, setUpdateTo] = React.useState(formatTime(seconds));

  function startOrResume() {
    handleIsActive(true);
    setTime(seconds);
    setUpdateTo(formatTime(seconds));
  }

  function onReset() {
    handleIsActive(false);
    onClose();
    setUpdateTo("00:00");
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
        <Digital
          size={size}
          seconds={seconds}
          updateTo={updateTo}
          setUpdateTo={setUpdateTo}
          setTime={setTime}
          pause={pause}
        />
      ) : (
        <Analog
          size={size}
          seconds={seconds}
          updateTo={updateTo}
          setUpdateTo={setUpdateTo}
          setTime={setTime}
          pause={pause}
        />
      )}
      <Stack
        direction={"column"}
        spacing={variant === "digital" ? 1 : 1.5}
        alignSelf="center"
      >
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
