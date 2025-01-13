import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Stack,
  useDisclosure,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import theme from "../../../../Constants/theme";
import {
  calculateElapsedTime,
  computeSeconds,
  formatTime,
  formatTimeInput,
} from "../../../../utils/Time/time";
import ConfirmModal from "../../../ConfirmModal";
import { STOPWATCH_TIMESTAMP_KEY } from "../../../../Hooks/useCreateWorkoutForm";

function EditableText({
  fontSize,
  seconds,
  updateTo,
  setUpdateTo,
  setTime,
  pause,
  setStartTimestamp,
}: {
  fontSize: string;
  seconds: number;
  updateTo: string;
  setUpdateTo: (value: string) => void;
  setTime: (elapsedSeconds: number) => void;
  pause: () => void;
  setStartTimestamp: (timestamp: number | null) => void;
}) {
  const [beingEdited, setBeingEdited] = React.useState(false);

  const handleChange = (value: string) => {
    // Format user input string and update UI
    let formattedValue = formatTimeInput(value);
    setUpdateTo(value);

    // Compute new elapsed seconds and update form state
    const newSeconds = computeSeconds(formattedValue);
    const newTimestamp = Date.now() - newSeconds * 1000;
    setTime(newSeconds);

    // Update the start time stamp for accurate elapsed time
    sessionStorage.setItem(STOPWATCH_TIMESTAMP_KEY, newTimestamp.toString());
    setStartTimestamp(newTimestamp);
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
  setStartTimestamp,
}: {
  size: "sm" | "md";
  seconds: number;
  updateTo: string;
  setUpdateTo: (value: string) => void;
  setTime: (elapsedSeconds: number) => void;
  pause: () => void;
  setStartTimestamp: (timestamp: number | null) => void;
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
        <EditableText
          seconds={seconds}
          updateTo={updateTo}
          setUpdateTo={setUpdateTo}
          setTime={setTime}
          pause={pause}
          setStartTimestamp={setStartTimestamp}
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

interface StopwatchProps {
  seconds: number;
  isActive: boolean;
  omitControls?: boolean;
  setTime: (elapsedSeconds: number) => void;
  handleIsActive: ((newState: boolean) => void) | null;
}

export default function Stopwatch({
  seconds,
  isActive,
  omitControls = false,
  setTime,
  handleIsActive,
}: StopwatchProps) {
  const [startTimestamp, setStartTimestamp] = useState(() => {
    const storedTimestamp = sessionStorage.getItem(STOPWATCH_TIMESTAMP_KEY);
    return storedTimestamp ? parseInt(storedTimestamp, 10) : null;
  });
  // updateTo is an unformatted user-input string. It's a temporary
  // variable before formatting and saving to the form state.
  const [updateTo, setUpdateTo] = React.useState(formatTime(seconds));

  useEffect(() => {
    const storedTimestamp = sessionStorage.getItem(STOPWATCH_TIMESTAMP_KEY);
    if (storedTimestamp) {
      setStartTimestamp(parseInt(storedTimestamp, 10));
    }
  }, [startTimestamp]);

  function start() {
    const newTimestamp = Date.now();
    sessionStorage.setItem(STOPWATCH_TIMESTAMP_KEY, newTimestamp.toString());
    setStartTimestamp(newTimestamp);
    if (handleIsActive) {
      handleIsActive(true);
    }
  }

  function resume() {
    if (handleIsActive) {
      handleIsActive(true);
    }
    setTime(calculateElapsedTime(startTimestamp ?? 0));
  }

  function startOrResume() {
    seconds === 0 ? start() : resume();
  }

  function reset() {
    if (handleIsActive) {
      handleIsActive(false);
    }
    setStartTimestamp(null);
    sessionStorage.removeItem(STOPWATCH_TIMESTAMP_KEY);
    setTime(0);
    setUpdateTo("00:00");
    onClose();
  }

  function stop() {
    if (handleIsActive) {
      handleIsActive(false);
    }
    setTime(calculateElapsedTime(startTimestamp ?? 0));
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack
      direction={"row"}
      w="100%"
      justifyContent={omitControls ? "center" : "space-between"}
      alignItems="flex-end"
    >
      <Analog
        size={"md"}
        seconds={seconds}
        updateTo={updateTo}
        setUpdateTo={setUpdateTo}
        setTime={setTime}
        pause={stop}
        setStartTimestamp={setStartTimestamp}
      />
      {!omitControls && (
        <Stack direction={"column"} spacing={1.5} alignSelf="center">
          <Button
            w="55px"
            h="20px"
            fontSize="12px"
            variant="secondary"
            onClick={onOpen}
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            Reset
          </Button>
          <Button
            w="55px"
            h="20px"
            fontSize="12px"
            variant="primary"
            onClick={isActive ? stop : startOrResume}
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            {isActive ? "Stop" : seconds === 0 ? "Start" : "Resume"}
          </Button>

          <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirmation={reset}
            ModalTitle="Reset Timer"
            ModalBodyText="Are you sure you would like to reset the stopwatch? This cannot be undone."
            CloseText="Cancel"
            ProceedText="Reset"
            variant="warn"
          />
        </Stack>
      )}
    </Stack>
  );
}
