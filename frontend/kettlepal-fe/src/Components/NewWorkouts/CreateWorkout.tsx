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
  Heading,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaComment,
  FaMinusCircle,
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
import WorkoutDate from "./FormComponents/NewWorkout/Workout/WorkoutDate";
import WorkoutComment from "./FormComponents/NewWorkout/Workout/WorkoutComment";
import useCreateWorkoutForm from "../../Hooks/useCreateWorkoutForm";
import WorkoutStopwatch from "./FormComponents/NewWorkout/Workout/WorkoutStopwatch";
import { useNavigate } from "react-router-dom";
import Detail from "../ViewWorkouts/ViewDetailedWorkoutModal/Detail";
import { formatDurationShort } from "../../utils/Time/time";
import { totalWorkoutWorkCapacity } from "../../utils/Workouts/workouts";

export default function CreateWorkout() {
  const {
    state,
    loading,
    error,
    showTracking,
    addComments,
    showUploadSuccess,
    submitted,
    showServerError,
    timerIsActive,
    isOpenSaveWorkout,
    workoutState,
    ref,
    formHasErrors,
    setTime,
    setComment,
    setShowServerError,
    setAddComments,
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
  const navigate = useNavigate();

  if (loading) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }
  const workoutErrors = [
    ...state.date.errors,
    ...state.comment.errors,
    ...state.elapsedSeconds.errors,
  ];

  function getCompletedSetsFromMemory(): {
    trackingIndex: number;
    completedCount: number;
    exerciseTitle?: string;
  }[] {
    const PREFIX = "completedSets-";
    const completedSets: {
      trackingIndex: number;
      completedCount: number;
      exerciseTitle?: string;
    }[] = [];

    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) {
        const trackingIndex = Number(key.slice(PREFIX.length));
        if (!Number.isNaN(trackingIndex)) {
          const exerciseTitle =
            state.exercises[state.exercises.length - 1 - trackingIndex]?.title
              .value;
          completedSets.push({
            trackingIndex,
            completedCount: Number(sessionStorage.getItem(key) || 0),
            exerciseTitle,
          });
        }
      }
    });
    return completedSets;
  }

  const completedSets = getCompletedSetsFromMemory();
  const incompleteExercises: {
    index: number;
    title: string;
    plannedSets: number;
    completedSets: number;
  }[] = [];
  state.exercises.forEach((exercise, currentIndex) => {
    // Convert CURRENT index to TRACKING index (reverse order)
    const trackingIndex = state.exercises.length - 1 - currentIndex;
    const completedData = completedSets.find(
      (cs) => cs.trackingIndex === trackingIndex
    );
    const plannedSets = Number(exercise.sets.value) || 0;
    const completedCount = completedData?.completedCount || 0;

    if (plannedSets > 0 && completedCount < plannedSets) {
      incompleteExercises.push({
        index: currentIndex,
        title: exercise.title.value,
        plannedSets,
        completedSets: completedCount,
      });
    }
  });

  const allSetsCompleted = incompleteExercises.length === 0;

  return (
    <Box m={["0.5rem", "1rem"]} w={["100%", "100%", "100%", "900px"]}>
      <Flex direction="column" minH="100%">
        <Grid
          w="100%"
          templateRows={[
            workoutState !== "submit"
              ? "60px 32px 32px"
              : "60px 32px 32px 32px",
            workoutState !== "submit"
              ? "70px 42px 42px"
              : "70px 42px 42px 42px",
          ]}
          templateColumns="repeat(2, 1fr)"
          gap={2}
          mb="0.5rem"
        >
          {/* WORKOUT DATE */}
          <GridItem rowStart={1} rowEnd={2} colStart={1} colEnd={1}>
            <WorkoutDate
              submitted={submitted}
              date={state.date.value}
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
              seconds={state.elapsedSeconds.value}
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

        {submitted && formHasErrors() && (
          <Text my="0.25rem" color={theme.colors.error} fontSize="xs">
            • Please fix the form errors before saving your workout.
          </Text>
        )}

        {/* ERROR MESSAGES */}
        <Box mt="-0.3rem">
          {workoutErrors.map((error) => {
            if (!submitted) {
              return null;
            }
            return (
              <Text key={error} color={theme.colors.error} fontSize="xs">
                • {error}
              </Text>
            );
          })}
        </Box>

        {/* WORKOUT COMMENT */}
        <WorkoutComment
          commentIsInvalid={submitted && state.comment.errors.length > 0}
          addComments={addComments}
          comment={state.comment.value}
          setComment={setComment}
        />

        {showUploadSuccess ? (
          <Alert status="success" mt="2rem" borderRadius={"8px"} bg="green.50">
            <AlertIcon />
            Workout Saved Successfully!
          </Alert>
        ) : (
          <>
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
          </>
        )}

        {/* EXERCISES */}
        <motion.div layoutRoot>
          <AnimatePresence mode="popLayout">
            {state.exercises.map((exercise, index) => {
              return (
                <motion.div
                  key={exercise.key}
                  layout="position"
                  layoutId={exercise.key}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{
                    layout: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Box my="1.25rem">
                    <CreateExercise
                      key={index}
                      exercise={exercise}
                      handleExercise={handleExercise}
                      deleteExercise={deleteExercise}
                      exerciseIndex={index}
                      trackingIndex={state.exercises.length - index - 1}
                      submitted={submitted}
                      trackWorkout={showTracking}
                      showComments={addComments}
                    />
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {!showTracking && (
          <Center mt="auto">
            <Text
              my="1rem"
              fontSize={["sm", "md"]}
              color={theme.colors.gray[500]}
              textAlign="center"
              whiteSpace="normal"
            >
              Customize your available exercises by adding{" "}
              <Link
                onClick={() => navigate("/settings")}
                textDecoration="underline"
                color={theme.colors.gray[500]}
              >
                Exercise Templates
              </Link>
              !
            </Text>
          </Center>
        )}

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

        <ConfirmModal
          isOpen={isOpenSaveWorkout}
          onClose={onCloseSaveWorkout}
          onConfirmation={onSaveWorkout}
          ModalTitle="Save Workout"
          ModalBodyText={
            <Box mb="1rem">
              Are you sure your workout is complete, and ready to be saved?
              {!allSetsCompleted && (
                <Alert status="warning" mt="1rem" borderRadius="8px" px="12px">
                  <AlertIcon />
                  <AlertDescription>
                    <Text fontSize="12px" fontWeight="500">
                      Some exercises were not completed.
                    </Text>
                  </AlertDescription>
                </Alert>
              )}
              {state.exercises.length > 0 && (
                <>
                  {state.date && (
                    <>
                      <Heading fontSize="xl" flex="1" my="1rem">
                        {dayjs(state.date.value).format("dddd, MMMM DD, YYYY")}
                      </Heading>
                    </>
                  )}

                  <HStack
                    w="100%"
                    justifyContent="space-evenly"
                    mt="1rem"
                    mb="1.5rem"
                  >
                    <Detail
                      title={"Time"}
                      value={formatDurationShort(
                        state.elapsedSeconds.value ?? 0
                      )}
                      variant="md"
                      color={theme.colors.graphPrimary[500]}
                    />
                    <br />
                    <Detail
                      title={"Work Capacity"}
                      value={totalWorkoutWorkCapacity({
                        exercises: state.exercises.map((exercise) => ({
                          weight: Number(exercise.weight.value),
                          weightUnit: exercise.weightUnit.value,
                          sets: Number(exercise.sets.value),
                          reps: Number(exercise.reps.value),
                          multiplier: Number(exercise.multiplier.value),
                        })),
                      })}
                      variant="md"
                      color={theme.colors.graphSecondary[500]}
                    />
                  </HStack>

                  {state.exercises.map((exercise, index) => {
                    const incompleteEntry = incompleteExercises.find(
                      (entry) => entry.index === index
                    );
                    const isIncomplete = !!incompleteEntry;
                    return (
                      <React.Fragment key={index}>
                        <HStack my="0.25rem">
                          {isIncomplete ? (
                            <Icon
                              as={FaMinusCircle}
                              color={theme.colors.lion[700]}
                            />
                          ) : (
                            <Icon
                              as={FaCheckCircle}
                              color={theme.colors.green[300]}
                            />
                          )}
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
                          {incompleteEntry && (
                            <Text
                              fontSize="14px"
                              color={theme.colors.gray[700]}
                            >
                              ({incompleteEntry.completedSets} of{" "}
                              {incompleteEntry.plannedSets})
                            </Text>
                          )}
                        </HStack>
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
      </Flex>
    </Box>
  );
}
