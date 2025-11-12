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
  Grid,
  GridItem,
  HStack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  FaComment,
  FaPause,
  FaPlay,
  FaPlusCircle,
  FaSave,
} from "react-icons/fa";
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
    workoutState,
    ref,
    setTime,
    setComment,
    setShowServerError,
    setAddComments,
    setFormHasErrors,
    handleTimerIsActive,
    handleStateChange,
    handleAddExercise,
    handleExercise,
    deleteExercise,
    onOpenSaveWorkout,
    onCloseSaveWorkout,
    onSaveWorkout,
    startOrPause,
  } = useCreateWorkoutForm();

  if (loading) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  return (
    <Box m={["0.5rem", "1rem"]} w={["100%", "100%", "100%", "900px"]}>
      <Grid
        w="100%"
        templateRows={[
          workoutState !== "submit" ? "60px 32px 32px" : "60px 32px 32px 32px",
          workoutState !== "submit" ? "70px 42px 42px" : "70px 42px 42px 42px",
        ]}
        templateColumns="repeat(2, 1fr)"
        gap={2}
        mb="0.5rem"
      >
        {/* WORKOUT DATE */}
        <GridItem rowStart={1} rowEnd={2} colStart={1} colEnd={1}>
          <WorkoutDate
            submitted={submitted}
            date={state.date}
            handleStateChange={handleStateChange}
          />
        </GridItem>

        {/* STOPWATCH */}
        <GridItem
          justifySelf={["center", "end"]}
          rowStart={1}
          rowEnd={3}
          colStart={2}
          colEnd={2}
        >
          <WorkoutStopwatch
            ref={ref}
            seconds={state.elapsedSeconds}
            omitControls={true}
            isActive={timerIsActive}
            setTime={setTime}
            handleIsActive={handleTimerIsActive}
          />
        </GridItem>

        {/* COMMENTS */}
        {workoutState !== "active" && (
          <GridItem
            rowStart={workoutState === "initial" ? 2 : 3}
            rowEnd={workoutState === "initial" ? 2 : 3}
            colStart={1}
            colEnd={1}
          >
            <Button
              size={["sm", "md"]}
              variant="secondary"
              leftIcon={<FaComment />}
              onClick={() => setAddComments((prev) => !prev)}
              w="100%"
              maxW={"200px"}
              sx={{
                _focus: {
                  borderColor: theme.colors.green[300],
                  boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
                },
              }}
            >
              {addComments ? "Hide Comments" : "Add Comments"}
            </Button>
          </GridItem>
        )}
        {workoutState !== "active" && (
          <GridItem rowStart={3} rowEnd={3} colStart={2} colEnd={2}>
            <Flex justify="flex-end">
              <Button
                size={["sm", "md"]}
                variant="secondary"
                onClick={handleAddExercise}
                leftIcon={<FaPlusCircle />}
                maxWidth="200px"
                w="100%"
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
          </GridItem>
        )}

        <GridItem
          rowStart={
            workoutState === "active" ? 3 : workoutState === "initial" ? 3 : 4
          }
          rowEnd={
            workoutState === "active" ? 3 : workoutState === "initial" ? 3 : 4
          }
          colStart={workoutState === "submit" ? 2 : 1}
          colEnd={
            workoutState === "submit" ? 3 : workoutState === "initial" ? 2 : 3
          }
        >
          <Flex
            justify={workoutState === "initial" ? "flex-start" : "flex-end"}
          >
            <Button
              size={["sm", "md"]}
              variant="primary"
              isDisabled={state.exercises.length === 0 && !showTracking}
              onClick={startOrPause}
              w="100%"
              maxWidth={workoutState === "active" ? "100%" : "200px"}
              leftIcon={showTracking ? <FaPause /> : <FaPlay />}
              sx={{
                _focus: {
                  borderColor: theme.colors.green[300],
                  boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
                },
              }}
            >
              {workoutState === "initial"
                ? "Start"
                : workoutState === "active"
                ? "Pause"
                : "Resume"}
            </Button>
          </Flex>
        </GridItem>

        {workoutState === "submit" && (
          <GridItem rowStart={4} rowEnd={4} colStart={1} colEnd={1}>
            <Button
              size={["sm", "md"]}
              variant="primary"
              leftIcon={<FaSave />}
              onClick={onOpenSaveWorkout}
              isDisabled={
                workoutState !== "submit" || state.exercises.length === 0
              }
              maxWidth="200px"
              w="100%"
              sx={{
                _focus: {
                  borderColor: theme.colors.green[300],
                  boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
                },
              }}
            >
              Finish
            </Button>
          </GridItem>
        )}
      </Grid>

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

      {/* WORKOUT COMMENT */}
      <WorkoutComment
        addComments={addComments}
        comment={state.comment}
        setComment={setComment}
      />

      {state.exercises.length === 0 && workoutState !== "submit" && (
        <Center>
          <Text
            fontSize={["sm", "md"]}
            color={theme.colors.gray[600]}
            mt="3rem"
          >
            <i>
              {showTracking ? (
                <>
                  Click <b>Pause</b>, then design your workout.
                </>
              ) : (
                <>
                  Design your workout, then click <b>Start</b>.
                </>
              )}
            </i>
          </Text>
        </Center>
      )}

      {/* EXERCISES */}
      <Box mt="1.25rem">
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
