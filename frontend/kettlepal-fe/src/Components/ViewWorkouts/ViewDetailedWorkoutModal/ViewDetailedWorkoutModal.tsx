import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  VStack,
  HStack,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UserWithWorkoutsQuery } from "../../../generated/frontend-types";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import EditWorkout from "./EditWorkout";
import ShowWorkout from "./ShowWorkout";

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
  const [editing, setEditing] = useState(false);

  // Modal controls for Mutating the workout
  const {
    isOpen: isOpenUpdateWorkout,
    onOpen: onOpenUpdateWorkout,
    onClose: onCloseUpdateWorkout,
  } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent
          padding={["0.75rem 0.25rem", "1rem 0.5rem"]}
          m={["0.5rem"]}
        >
          <ModalBody p={["0.5rem", "1rem"]} overflow="scroll">
            {editing && (
              <Button
                fontSize={["xs", "sm"]}
                width="140px"
                variant="primary"
                position="absolute"
                left="16px"
                top="14px"
                h="32px"
                onClick={onOpenUpdateWorkout}
              >
                Save
              </Button>
            )}
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
                icon={<FaPencilAlt />}
                onClick={() => setEditing((prev) => !prev)}
              />
            </HStack>
            <VStack alignItems="flex-start" gap={0}>
              {editing ? (
                <EditWorkout
                  workoutWithExercises={workoutWithExercises}
                  refetchPastWorkouts={refetchPastWorkouts}
                  isOpen={isOpenUpdateWorkout}
                  onClose={onCloseUpdateWorkout}
                />
              ) : (
                <>
                  <ShowWorkout workoutWithExercises={workoutWithExercises} />
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
