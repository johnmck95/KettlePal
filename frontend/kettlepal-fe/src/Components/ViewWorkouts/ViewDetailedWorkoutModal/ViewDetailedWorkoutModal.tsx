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
  Alert,
  AlertIcon,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FuzzySearchQuery } from "../../../generated/frontend-types";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import EditWorkout from "./EditWorkout";
import ShowWorkout from "./ShowWorkout";
import theme from "../../../Constants/theme";

export default function ViewDetailedWorkoutModal({
  workoutWithExercises,
  isOpen,
  onClose,
  refetchPastWorkouts,
}: {
  workoutWithExercises: NonNullable<
    NonNullable<FuzzySearchQuery["pastWorkouts"]>["workoutWithExercises"]
  >[0];
  isOpen: boolean;
  onClose: () => void;
  refetchPastWorkouts: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState<boolean>(false);
  const [isMobile] = useMediaQuery("(max-width: 420px)");

  // Modal controls for Mutating the workout
  const {
    isOpen: isOpenUpdateWorkout,
    onOpen: onOpenUpdateWorkout,
    onClose: onCloseUpdateWorkout,
  } = useDisclosure();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        scrollBehavior="inside"
      >
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
                h="40px"
                onClick={onOpenUpdateWorkout}
                zIndex={3}
              >
                Save
              </Button>
            )}

            {/* SUCCESSFULLY UPDATED EXERCISE */}
            {showUploadSuccess && (
              <Alert
                status="success"
                my="2rem"
                w="100%%"
                borderRadius={"8px"}
                bg="green.50"
              >
                <AlertIcon />
                Workout Updated Successfully!
              </Alert>
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
                aria-label="Edit Exercise"
                size="sm"
                icon={<FaPencilAlt />}
                onClick={() => setEditing((prev) => !prev)}
                sx={{
                  _focus: {
                    borderColor: theme.colors.green[300],
                    boxShadow: isMobile
                      ? `0 0 0 0`
                      : `0 0 0 1px ${theme.colors.green[300]}`,
                  },
                }}
                zIndex={3}
              />
              <IconButton
                variant="secondary"
                aria-label="Close Modal"
                size="sm"
                icon={<FaTimes />}
                onClick={onClose}
                sx={{
                  _focus: {
                    borderColor: theme.colors.green[300],
                    boxShadow: isMobile
                      ? `0 0 0 0`
                      : `0 0 0 1px ${theme.colors.green[300]}`,
                  },
                }}
                zIndex={3}
              />
            </HStack>
            <VStack alignItems="flex-start" gap={0}>
              {editing ? (
                <EditWorkout
                  workoutWithExercises={workoutWithExercises}
                  refetchPastWorkouts={refetchPastWorkouts}
                  isOpen={isOpenUpdateWorkout}
                  onClose={onCloseUpdateWorkout}
                  setShowUploadSuccess={setShowUploadSuccess}
                  setEditing={setEditing}
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
