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
  Icon,
} from "@chakra-ui/react";
import theme from "../../Constants/theme";
import { beep } from "../../utils/audio";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import Countdown from "./Countdown";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function EmomTimerClock({
  schedule,
  emomConfig: config,
  setModalView,
  onClose,
  completedASet,
}: {
  schedule: CreateOrUpdateWorkoutState["exercises"];
  emomConfig: EmomConfig;
  setModalView: React.Dispatch<React.SetStateAction<"inputs" | "clock">>;
  onClose: () => void;
  completedASet: (exerciseKey: string) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
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
          setIsRunning(false);
          setIsFinished(true);
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

  const uniqueExercises = Array.from(
    new Map(schedule.map((exercise) => [exercise.key, exercise])).values()
  );

  function markSetsCompleted() {
    schedule.forEach((exercise) => {
      completedASet(exercise.key);
    });
    onClose();
    setModalView("inputs");
  }
  function exitWithoutMArkingSetsCompleted() {
    onClose();
    setModalView("inputs");
  }
  return (
    <VStack h="100%" alignItems="space-between" py="1rem">
      {isFinished ? (
        <ModalBody>
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="360px"
            h="100%"
          >
            {/* HEADER */}
            <VStack spacing={2} my="3rem">
              <Text
                fontSize={["xl", "2xl"]}
                fontWeight="bold"
                letterSpacing="0.12em"
                color={theme.colors.grey[600]}
              >
                WORKOUT COMPLETE
              </Text>

              <Text
                fontSize="sm"
                color={theme.colors.grey[500]}
                textAlign="center"
              >
                {config.rounds} round{config.rounds > 1 ? "s" : ""} completed
              </Text>
            </VStack>

            {/* COMPLETED EXERCISES */}
            <>
              {uniqueExercises.map((exercise, index) => {
                return (
                  <React.Fragment key={index}>
                    <HStack my="0.25rem">
                      <Icon
                        as={FaCheckCircle}
                        color={theme.colors.green[300]}
                      />
                      <Text fontSize="16px" fontWeight="600">
                        {formatExerciseString({
                          title: exercise.title.value,
                          weight: exercise.weight.value,
                          weightUnit: exercise.weightUnit.value,
                          sets: exercise.sets.value,
                          reps: exercise.reps.value,
                          repsDisplay: exercise.repsDisplay.value,
                          comment: exercise.comment.value,
                        })}
                      </Text>
                    </HStack>
                  </React.Fragment>
                );
              })}
            </>
            {config.mode === "linked" ? (
              <>
                <Text
                  fontSize="sm"
                  color={theme.colors.grey[500]}
                  textAlign="center"
                  mt="3rem"
                  mb="2rem"
                >
                  Would you like KettlePal to automatically mark these exercises
                  as completed?
                </Text>

                {/* ACTIONS */}
                <VStack spacing={4} w="100%" maxW="320px">
                  <Button
                    w="100%"
                    variant="primary"
                    onClick={markSetsCompleted}
                  >
                    Yes — Mark Completed
                  </Button>

                  <Button
                    w="100%"
                    variant="secondary"
                    onClick={exitWithoutMArkingSetsCompleted}
                  >
                    No — Handle Manually
                  </Button>
                </VStack>
              </>
            ) : (
              <Button
                w="100%"
                variant="secondary"
                onClick={exitWithoutMArkingSetsCompleted}
              >
                Exit EMOM Timer
              </Button>
            )}
          </Flex>
        </ModalBody>
      ) : (
        <>
          <ModalBody>
            <Flex
              direction="column"
              align="center"
              justify="flex-start"
              minH="360px"
              h="100%"
            >
              <HStack
                justifyContent={currentExercise ? "space-between" : "center"}
                w="100%"
                mt="1rem"
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

              <Button
                variant="secondary"
                onClick={() => setIsRunning((p) => !p)}
              >
                {isRunning ? "Pause" : "Resume"}
              </Button>
            </Flex>
          </ModalFooter>
        </>
      )}
    </VStack>
  );
}
