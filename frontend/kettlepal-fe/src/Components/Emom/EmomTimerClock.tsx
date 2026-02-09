import { useEffect, useState } from "react";
import { EmomConfig } from "../../Hooks/useEmomTimer";
import { CreateOrUpdateWorkoutState } from "../../Hooks/HookHelpers/validation";
import {
  Button,
  Flex,
  Text,
  ModalBody,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";
import theme from "../../Constants/theme";
import { beep } from "../../utils/audio";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import Countdown from "./Countdown";

export default function EmomTimerClock({
  schedule,
  emomConfig: config,
  setModalView,
}: {
  schedule: CreateOrUpdateWorkoutState["exercises"];
  emomConfig: EmomConfig;
  setModalView: React.Dispatch<React.SetStateAction<"inputs" | "clock">>;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const totalSeconds = config.rounds * 60;
  const currentRound = Math.min(Math.floor(elapsed / 60) + 1, config.rounds);
  const secondsLeftInRound = 59 - (elapsed % 60);
  const currentExercise = schedule[currentRound - 1];
  const nextExercise = schedule[currentRound];

  useEffect(() => {
    if (!isRunning) return;

    // slight audible timing issues are caused by lag in the audio beep, this is mostly just Safarii.
    // Logic is sound. If issues persist, update calibrateLatency() in audio.ts
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        const secondsLeft = 59 - (next % 60);
        const totalRounds = Math.ceil(totalSeconds / 60);
        const currentRound = Math.floor(next / 60) + 1;
        const roundsRemaining = totalRounds - currentRound;

        const isFinalSecond = next === totalSeconds - 1;

        // Final beep - end of EMOM.
        if (isFinalSecond) {
          clearInterval(interval);
          beep({ frequency: 440, duration: 750, volume: 0.6 });
          return next;
        }

        // Countdown beeps (skip entirely on last round)
        if (roundsRemaining > 0) {
          if (secondsLeft === 10)
            beep({ frequency: 900, duration: 60, volume: 0.2 });

          if (secondsLeft <= 5 && secondsLeft > 0)
            beep({ frequency: 700, duration: 60, volume: 0.4 });

          if (secondsLeft === 0)
            beep({ frequency: 700, duration: 450, volume: 0.4 });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  return (
    <>
      <ModalBody>
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="360px"
          gap={6}
        >
          {/* ROUND */}
          <VStack spacing={1}>
            <Text
              fontSize="sm"
              letterSpacing="0.15em"
              fontWeight="bold"
              color={theme.colors.grey[500]}
            >
              ROUND
            </Text>

            <Text fontSize="lg" fontWeight="semibold">
              {currentRound}/{config.rounds}
            </Text>
          </VStack>
          {/* CURRENT EXERCISE */}
          {currentExercise && (
            <Text color={theme.colors.grey[500]} fontSize="sm">
              <b>CURRENT EXERCISE: </b>{" "}
              {formatExerciseString({
                title: currentExercise.title.value,
                weight: currentExercise.weight.value,
                weightUnit: currentExercise.weightUnit.value,
                sets: currentExercise.sets.value,
                reps: currentExercise.reps.value,
                repsDisplay: currentExercise.repsDisplay.value,
                comment: currentExercise.comment.value,
              }) || "----"}
            </Text>
          )}

          {/* TIMER */}
          <Countdown remaining={secondsLeftInRound} />

          {/* NEXT EXERCISE*/}
          {nextExercise && (
            <Text color={theme.colors.grey[500]} fontSize="sm">
              <b>NEXT:</b>{" "}
              {formatExerciseString({
                title: nextExercise.title.value,
                weight: nextExercise.weight.value,
                weightUnit: nextExercise.weightUnit.value,
                sets: nextExercise.sets.value,
                reps: nextExercise.reps.value,
                repsDisplay: nextExercise.repsDisplay.value,
                comment: nextExercise.comment.value,
              }) || "----"}
            </Text>
          )}
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex w="100%" justify="space-between">
          <Button
            variant="link"
            onClick={() => {
              setElapsed(0);
              setIsRunning(false);
              setModalView("inputs");
            }}
          >
            Reset
          </Button>

          <Button variant="secondary" onClick={() => setIsRunning((p) => !p)}>
            {isRunning ? "Pause" : "Resume"}
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
}
