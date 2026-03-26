import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import theme from "../../Constants/theme";
import { beep } from "../../utils/audio";
import { CreateOrUpdateWorkoutState } from "../../Hooks/HookHelpers/validation";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import Countdown from "./Countdown";

export default function EmomStartDelay({
  seconds,
  firstExercise,
  onComplete,
  onReset,
}: {
  seconds: number;
  firstExercise: CreateOrUpdateWorkoutState["exercises"][0];
  onComplete: () => void;
  onReset: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        if (next <= 5 && next > 0) {
          beep({ frequency: 900, duration: 60, volume: 0.4 });
        }

        if (next === 0) {
          beep({ frequency: 700, duration: 450, volume: 0.4 });
          clearInterval(interval);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining === 0) {
      onComplete();
    }
  }, [remaining, onComplete]);

  return (
    <VStack h="100%" alignItems="space-between" mt="1rem">
      <ModalBody>
        <Flex direction="column" align="center" minH="360px" h="100%" gap={10}>
          <Text
            fontSize={["xl", "2xl", "3xl"]}
            letterSpacing="0.15em"
            fontWeight="bold"
            color={theme.colors.grey[500]}
            textAlign={"center"}
          >
            WORKOUT STARTS IN
          </Text>

          <Countdown remaining={remaining} />

          {firstExercise && (
            <VStack gap={0.5}>
              <Text
                fontSize={["xs", "sm", "md", "lg"]}
                letterSpacing="0.15em"
                fontWeight="bold"
                color={theme.colors.grey[500]}
                textAlign="center"
              >
                FIRST EXERCISE
              </Text>
              <Text
                fontSize={["xl", "2xl", "3xl"]}
                fontWeight="bold"
                w="100%"
                textAlign="center"
                color={theme.colors.grey[700]}
              >
                {formatExerciseString({
                  title: firstExercise.title.value,
                  weight: firstExercise.weight.value,
                  weightUnit: firstExercise.weightUnit.value,
                  sets: firstExercise.sets.value,
                  reps: firstExercise.reps.value,
                  repsDisplay: firstExercise.repsDisplay.value,
                  comment: firstExercise.comment.value,
                }) || "----"}
              </Text>
            </VStack>
          )}
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Flex w="100%" justify="space-between" mb="2rem">
          <Button
            variant="link"
            onClick={() => {
              setIsRunning(false);
              setRemaining(seconds);
              onReset();
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
