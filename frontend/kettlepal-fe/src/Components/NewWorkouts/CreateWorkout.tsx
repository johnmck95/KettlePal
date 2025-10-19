import React from "react";
import CreateExercise from "./CreateExercise";
import { AnimatePresence, motion } from "framer-motion";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import LoadingSpinner from "../LoadingSpinner";
import theme from "../../Constants/theme";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import dayjs from "dayjs";
import WorkoutDate from "./FormComponents.tsx/Workout/WorkoutDate";
import WorkoutComment from "./FormComponents.tsx/Workout/WorkoutComment";
import useCreateWorkoutForm from "../../Hooks/useCreateWorkoutForm";
import WorkoutStopwatch from "./FormComponents.tsx/Workout/WorkoutStopwatch";

export default function CreateWorkout() {
  const {
    state,
    loading,
    error,
    showTracking,
    addComments,
    showUploadSuccess,
    submitted,
    errors,
    showServerError,
    timerIsActive,
    isOpenSaveWorkout,
    setTime,
    setComment,
    setShowServerError,
    setAddComments,
    setShowTracking,
    setFormHasErrors,
    handleTimerIsActive,
    handleStateChange,
    handleAddExercise,
    handleExercise,
    deleteExercise,
    onOpenSaveWorkout,
    onCloseSaveWorkout,
    onSaveWorkout,
  } = useCreateWorkoutForm();

  if (loading) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  return (
    <Box
      m={["0.5rem 1rem 1rem 1rem", "1rem"]}
      w={["100%", "100%", "100%", "900px"]}
    >
      <HStack
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        mb="0.75rem"
        maxH={["90px", "120px"]}
      >
        {/* WORKOUT DATE */}
        <WorkoutDate
          submitted={submitted}
          date={state.date}
          handleStateChange={handleStateChange}
        />

        {/* STOPWATCH */}
        <WorkoutStopwatch
          seconds={state.elapsedSeconds}
          isActive={timerIsActive}
          setTime={setTime}
          handleIsActive={handleTimerIsActive}
        />
      </HStack>

      {/* ERROR MESSAGES */}
      <Box mt="-0.3rem">
        {errors.map((error) => {
          if (!submitted) {
            return null;
          }
          return (
            <Text key={error} color={theme.colors.error} fontSize="xs">
              {error}
            </Text>
          );
        })}
      </Box>

      <Flex
        w="100%"
        justifyContent={"space-between"}
        mt="1rem"
        gap={1}
        h={["74px", "86px", "42px"]}
      >
        {/* ADD COMMENTS & TRACK WORKOUT BUTTONS */}
        <Flex
          wrap={"wrap"}
          gap={[2, 1, 2]}
          justifyContent={["flex-end", "flex-start"]}
          alignContent={["flex-start"]}
          height="100%"
          flexDirection={["column", "row"]}
        >
          <Button
            size={["sm", "md"]}
            variant="secondary"
            onClick={() => setAddComments((prev) => !prev)}
            w={["140px", "140px", "auto"]}
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            {addComments ? "Hide Comments" : "Add Comments"}
          </Button>
          <Button
            size={["sm", "md"]}
            variant="secondary"
            onClick={() => setShowTracking((prev) => !prev)}
            w={["140px", "140px", "auto"]}
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            {showTracking ? "Hide Tracking" : "Track Workout"}
          </Button>
        </Flex>

        {/* SAVE WORKOUT & ADD EXERCISE BUTTONS */}
        <Flex
          wrap={"wrap"}
          gap={[2, 1, 2]}
          justifyContent={"flex-end"}
          alignContent={["flex-end", "flex-start"]}
          height="100%"
        >
          {state.exercises.length > 0 && (
            <Button
              size={["sm", "md"]}
              variant="secondary"
              leftIcon={<FaSave />}
              disabled={true}
              onClick={onOpenSaveWorkout}
              w={["140px", "150px", "200px"]}
              sx={{
                _focus: {
                  borderColor: theme.colors.green[300],
                  boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
                },
              }}
            >
              Save Workout
            </Button>
          )}
          <Button
            size={["sm", "md"]}
            variant="primary"
            onClick={handleAddExercise}
            leftIcon={<FaPlusCircle />}
            w={["140px", "150px", "200px"]}
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            Add Exercise
          </Button>
        </Flex>
      </Flex>

      {/* WORKOUT COMMENT */}
      <WorkoutComment
        addComments={addComments}
        comment={state.comment}
        setComment={setComment}
      />

      {/* EXERCISES */}
      <Box>
        <AnimatePresence>
          {state.exercises.map((exercise, index) => {
            return (
              <motion.div
                key={`${exercise.key}`}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <CreateExercise
                  key={index}
                  exercise={exercise}
                  handleExercise={handleExercise}
                  deleteExercise={deleteExercise}
                  exerciseIndex={index}
                  trackingIndex={state.exercises.length - index - 1}
                  submitted={submitted}
                  setFormHasErrors={setFormHasErrors}
                  trackWorkout={showTracking}
                  showComments={addComments}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      {error && showServerError && (
        <Alert
          status="error"
          mt="2rem"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <AlertDescription>{error?.message}</AlertDescription>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}

      {showUploadSuccess && (
        <Alert status="success" mt="2rem" borderRadius={"8px"} bg="green.50">
          <AlertIcon />
          Workout Saved Successfully!
        </Alert>
      )}

      <ConfirmModal
        isOpen={isOpenSaveWorkout}
        onClose={onCloseSaveWorkout}
        onConfirmation={onSaveWorkout}
        ModalTitle="Save Workout"
        ModalBodyText={
          <Box mb="1rem">
            Are you sure your workout is complete, and ready to be saved?
            {state.exercises.length > 0 && (
              <>
                <br />
                <br />
                {state.date && (
                  <>
                    {dayjs(state.date).format("dddd, MMMM DD, YYYY")}
                    <br />
                  </>
                )}
                {state.exercises.map((exercise, index) => {
                  return (
                    <React.Fragment key={index}>
                      {formatExerciseString(exercise)} <br />
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </Box>
        }
        CloseText="Cancel"
        ProceedText="Save"
        variant="confirm"
      />
    </Box>
  );
}
