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
  HStack,
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
    <VStack h="100%" alignItems="space-between" py="1rem">
      <ModalBody>
        <Flex
          direction="column"
          align="center"
          justify="space-evenly"
          minH="360px"
          h="100%"
        >
          <HStack
            justifyContent={currentExercise ? "space-between" : "center"}
            w="100%"
          >
            {/* ROUND */}
            <VStack alignItems="flex-start">
              <Text
                fontSize={["md", "lg", "xl", "2xl"]}
                letterSpacing="0.15em"
                fontWeight="bold"
                color={theme.colors.grey[500]}
                textAlign="center"
              >
                ROUND
              </Text>
              <Text
                fontSize={["sm", "md", "lg", "xl"]}
                fontWeight="semibold"
                w="100%"
                textAlign="center"
                color={theme.colors.grey[700]}
              >
                {currentRound} / {config.rounds}
              </Text>
            </VStack>

            {/* CURRENT EXERCISE */}
            {currentExercise && (
              <VStack>
                <Text
                  fontSize={["md", "lg", "xl", "2xl"]}
                  letterSpacing="0.15em"
                  fontWeight="bold"
                  color={theme.colors.grey[500]}
                  textAlign={"center"}
                >
                  CURRENT EXERCISE
                </Text>
                <Text
                  color={theme.colors.grey[700]}
                  fontSize={["sm", "md", "lg", "xl"]}
                  fontWeight="semibold"
                  textAlign="center"
                >
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
              </VStack>
            )}
          </HStack>

          {/* TIMER */}
          <Countdown remaining={secondsLeftInRound} />

          {/* NEXT EXERCISE*/}
          {nextExercise && (
            <VStack>
              <Text
                fontSize={["sm", "md", "lg", "xl"]}
                letterSpacing="0.15em"
                fontWeight="bold"
                color={theme.colors.grey[500]}
                textAlign={"center"}
              >
                NEXT EXERCISE
              </Text>
              <Text
                color={theme.colors.grey[600]}
                fontSize={["xs", "sm", "md", "lg"]}
                textAlign="center"
              >
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
            </VStack>
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
    </VStack>
  );
}
