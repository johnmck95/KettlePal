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
import { formatExerciseString } from "../../utils/Exercises/exercises";
import { formatDurationShort, postgresToDayJs } from "../../utils/Time/time";
import { totalWorkoutWorkCapacity } from "../../utils/Workouts/workouts";
import { UserWithWorkoutsQuery } from "../../generated/frontend-types";

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
  exercise: NonNullable<
    NonNullable<
      NonNullable<UserWithWorkoutsQuery["user"]>["workouts"][0]
    >["exercises"]
  >[0];
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
            <Detail
              title={"Total Reps"}
              value={`${(sets * reps).toLocaleString()}`}
            />
          )}
          {!!sets && !!reps && !!weight && !!weightUnit && (
            <Detail
              title={"Work Capacity"}
              value={`${(sets * reps * weight).toLocaleString()} ${weightUnit}`}
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
  workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showDetails, setShowDetails] = React.useState(false);
  const { comment, createdAt, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent padding="1rem 0.5rem" m="1rem">
          <ModalCloseButton />
          <ModalBody p="1rem" overflow="scroll">
            <VStack alignItems="flex-start" gap={0}>
              {/* DATE */}
              <Text fontSize={["lg", "2xl"]}>
                <b>
                  {postgresToDayJs(createdAt ?? "").format(
                    "dddd, MMMM DD, YYYY"
                  )}
                </b>
              </Text>
              {/* WORKOUT COMMENT */}
              <Text fontSize={["sm", "md"]} color={theme.colors.grey[700]}>
                <i>{comment}</i>
              </Text>
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
                  "& > *:not(:first-of-type)": {
                    borderTop: showDetails
                      ? `1px solid ${theme.colors.feldgrau[100]}`
                      : "none",
                  },
                }}
              >
                {/* EXERCISES */}
                {exercises?.map((exercise) => (
                  <ViewDetailedExercise
                    key={exercise.uid}
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
