import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  ModalOverlay,
  VStack,
  HStack,
  Button,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import theme from "../../Constants/theme";
import { WorkoutWithExercises } from "../../Constants/types";
import CalendarWidget from "../CalendarWidget";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import { formatDurationShort } from "../../utils/Time/time";
import { totalWorkoutWorkCapacity } from "../../utils/Workouts/workouts";

function Detail({
  title,
  value,
  variant = "sm",
}: {
  title: string;
  value: string;
  variant?: "sm" | "md";
}) {
  return (
    <VStack gap={0} minWidth={variant === "sm" ? "80px" : "120px"}>
      <Text
        fontSize={variant === "sm" ? ["8px", "12px"] : ["xs", "sm"]}
        color={theme.colors.grey[700]}
      >
        {title}
      </Text>
      <Text fontSize={variant === "sm" ? ["14px", "18px"] : ["lg", "xl"]}>
        <b>{value}</b>
      </Text>
    </VStack>
  );
}

function ViewDetailedExercise({
  exercise,
  showDetails,
}: {
  exercise: WorkoutWithExercises["exercises"][0];
  showDetails: boolean;
}) {
  const { elapsedSeconds, sets, reps, weight, weightUnit, comment } = exercise;
  return (
    <VStack
      w="100%"
      alignItems={"flex-start"}
      gap={0}
      color={theme.colors.grey[800]}
      my="0.5rem"
    >
      <Text
        fontSize={showDetails ? "xl" : "md"}
        mt={showDetails ? "0.5rem" : "0"}
        color={theme.colors.black}
      >
        <b>{formatExerciseString(exercise)}</b>
      </Text>
      {!!comment && showDetails && (
        <Text ml="0.5rem" fontSize="sm" color={theme.colors.grey[700]}>
          <i>{comment}</i>
        </Text>
      )}
      {showDetails && (
        <Flex
          justifyContent="space-evenly"
          flexWrap="wrap"
          mt="0.5rem"
          w="100%"
        >
          {!!elapsedSeconds && (
            <Detail
              title={"Elapsed Time"}
              value={formatDurationShort(elapsedSeconds ?? 0)}
            />
          )}
          {!!sets && !!reps && (
            <Detail title={"Total Reps"} value={`${sets * reps}`} />
          )}
          {!!sets && !!reps && !!weight && !!weightUnit && (
            <Detail
              title={"Work Capacity"}
              value={`${sets * reps * weight} ${weightUnit}`}
            />
          )}
        </Flex>
      )}
    </VStack>
  );
}

export default function ViewDetailedWorkoutModal({
  workoutWithExercises,
  isOpen,
  onClose,
}: {
  workoutWithExercises: WorkoutWithExercises;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showDetails, setShowDetails] = React.useState(false);
  const { comment, createdAt, exercises, elapsedSeconds } =
    workoutWithExercises;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent padding="1rem 0.5rem" m="1rem">
          <ModalCloseButton />
          <ModalBody p="1rem" overflow="scroll">
            <VStack alignItems="flex-start">
              {/* CALENDAR AND WORKOUT COMMENT */}
              <HStack
                w="100%"
                justifyContent={"space-between"}
                alignItems="flex-end"
              >
                <CalendarWidget date={createdAt} w="4rem" />
                <Text ml="0.5rem" color={theme.colors.grey[700]}>
                  <i>{comment}</i>
                </Text>
              </HStack>
              {/* ELAPSED TIME AND TOTAL WORK CAPACITY */}
              <HStack w="100%" justifyContent="space-evenly" my="1rem">
                <Detail
                  title={"Elapsed Time"}
                  value={formatDurationShort(elapsedSeconds ?? 0)}
                  variant="md"
                />
                <Detail
                  title={"Work Capacity"}
                  value={totalWorkoutWorkCapacity(workoutWithExercises)}
                  variant="md"
                />
              </HStack>
              {/* SHOW DETAILS BUTTON */}
              <Button
                fontSize={["xs", "sm"]}
                width="100%"
                variant="primary"
                onClick={() =>
                  setShowDetails((prevShowDetails) => !prevShowDetails)
                }
                mb="0.5rem"
              >
                {showDetails ? "Hide" : "Show"} Details
              </Button>
              <Box
                width="100%"
                margin="0"
                padding="0"
                sx={{
                  "& > *:not(:first-child)": {
                    borderTop: showDetails
                      ? `1px solid ${theme.colors.lion[100]}`
                      : "none",
                  },
                }}
              >
                {/* EXERCISES */}
                {exercises.map((exercise) => (
                  <ViewDetailedExercise
                    exercise={exercise}
                    showDetails={showDetails}
                  />
                ))}
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
