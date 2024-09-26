import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  Text,
  ModalOverlay,
  VStack,
  HStack,
  Button,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import theme from "../../../Constants/theme";
import { formatDurationShort, postgresToDayJs } from "../../../utils/Time/time";
import { totalWorkoutWorkCapacity } from "../../../utils/Workouts/workouts";
import { UserWithWorkoutsQuery } from "../../../generated/frontend-types";
import { FaMinus, FaPencilAlt, FaTimes } from "react-icons/fa";
import Detail from "./Detail";
import ViewDetailedExercise from "./ViewDetailedExercise";
import EditWorkout from "./EditWorkout";

export default function ViewDetailedWorkoutModal({
  workoutWithExercises,
  isOpen,
  onClose,
  refetchPastWorkouts,
}: {
  workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0];
  isOpen: boolean;
  onClose: () => void;
  refetchPastWorkouts: () => void;
}) {
  const [showDetails, setShowDetails] = React.useState(false);
  const { comment, createdAt, exercises, elapsedSeconds } =
    workoutWithExercises ?? {};
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent
          padding={["0.75rem 0.25rem", "1rem 0.5rem"]}
          m={["0.5rem"]}
        >
          <ModalBody p={["0.5rem", "1rem"]} overflow="scroll">
            <HStack
              justifyContent={"flex-end"}
              gap={2}
              maxW="75px"
              alignSelf="flex-end"
              position="absolute"
              right="16px"
              top="14px"
            >
              <IconButton
                variant="secondary"
                aria-label="Close Modal"
                size="sm"
                icon={<FaTimes />}
                onClick={onClose}
              />
              <IconButton
                variant="secondary"
                aria-label="Edit Exercise"
                size="sm"
                icon={editing ? <FaMinus /> : <FaPencilAlt />}
                onClick={() => setEditing((prev) => !prev)}
              />
            </HStack>
            <VStack alignItems="flex-start" gap={0}>
              {editing ? (
                <EditWorkout
                  workoutWithExercises={workoutWithExercises}
                  refetchPastWorkouts={refetchPastWorkouts}
                />
              ) : (
                <>
                  {/* DATE */}
                  <Text
                    fontSize={["lg", "2xl"]}
                    maxW="calc(100% - 75px)"
                    overflow="scroll"
                  >
                    <b>
                      {postgresToDayJs(createdAt ?? "").format(
                        "ddd, MMM DD, YYYY"
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
                </>
              )}

              {/* SHOW DETAILS BUTTON */}
              <Button
                fontSize={["xs", "sm"]}
                width="100%"
                variant="primary"
                onClick={() =>
                  setShowDetails((prevShowDetails) => !prevShowDetails)
                }
                my="0.5rem"
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
                    refetchPastWorkouts={refetchPastWorkouts}
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
