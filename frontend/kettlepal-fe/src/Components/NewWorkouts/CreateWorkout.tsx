import React, { ChangeEvent, useEffect, useState } from "react";
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
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import { getCurrentDate } from "../../utils/Time/time";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import { useUser } from "../../Contexts/UserContext";
import LoadingSpinner from "../LoadingSpinner";
import theme from "../../Constants/theme";
import Timer from "../Timer";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import dayjs from "dayjs";
import { useAddWorkoutWithExercisesMutation } from "../../generated/frontend-types";

export type CreateWorkoutState = {
  createdAt: string;
  comment: string;
  elapsedSeconds: number;
  exercises: Array<{
    title: string;
    weight: string;
    weightUnit: string;
    sets: string;
    reps: string;
    repsDisplay: string;
    comment: string;
    elapsedSeconds: number;
    key: string;
  }>;
};

export default function CreateWorkout() {
  const [state, setState] = useState<CreateWorkoutState>({
    createdAt: getCurrentDate(),
    comment: "",
    elapsedSeconds: 0,
    exercises: [],
  });
  const [showTracking, setShowTracking] = useState<boolean>(false);
  const [addWorkoutComment, setAddWorkoutComment] = useState<boolean>(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState<boolean>(false);
  const [addWorkoutWithExercises, { loading, error }] =
    useAddWorkoutWithExercisesMutation({
      onCompleted() {
        setState({
          createdAt: getCurrentDate(),
          comment: "",
          elapsedSeconds: 0,
          exercises: [],
        });
        setShowUploadSuccess(true);
        setTimeout(() => {
          setShowUploadSuccess(false);
        }, 5000);
      },
    });
  const [submitted, setSubmitted] = useState(false);
  const [formHasErrors, setFormHasErrors] = useState(false);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const userUid = useUser().user?.uid ?? null;

  // Update workout timer every 1s
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (timerIsActive) {
      interval = setInterval(() => {
        setTime(state.elapsedSeconds + 1);
      }, 1000);
    } else if (!timerIsActive && state.elapsedSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, state.elapsedSeconds]);

  const setTime = (elapsedSeconds: number) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      elapsedSeconds,
    }));
  };

  const setComment = (newComment: string) => {
    setState((prevState: CreateWorkoutState) => ({
      ...prevState,
      comment: newComment,
    }));
  };

  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleAddExercise(): void {
    setState((prevState) => ({
      ...prevState,
      exercises: [
        ...prevState.exercises,
        {
          title: "",
          weight: "",
          weightUnit: "kg",
          sets: "",
          reps: "",
          repsDisplay: "std",
          comment: "",
          elapsedSeconds: 0,
          key: `key-${Date.now()}-${Math.random().toString(36)}`,
        },
      ],
    }));
  }

  function deleteExercise(index: number): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.filter((_, i) => i !== index),
    }));
  }

  function handleExercise(
    name: string,
    value: string | number,
    index: number
  ): void {
    setState((prevState) => ({
      ...prevState,
      exercises: prevState.exercises.map((exercise, i) => {
        if (i === index) {
          return {
            ...exercise,
            [name]: value,
          };
        }
        return exercise;
      }),
    }));
  }

  // Save Workout Modal Controls
  const {
    isOpen: isOpenSaveWorkout,
    onOpen: onOpenSaveWorkout,
    onClose: onCloseSaveWorkout,
  } = useDisclosure();

  const dateIsInvalid = !state.createdAt;
  const timerIsInvalid = timerIsActive;

  enum WorkoutErrors {
    date = "Please enter a workout date.",
    timer = "Please stop the workout timer before saving.",
  }

  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (dateIsInvalid) errors.push(WorkoutErrors.date);
  if (timerIsInvalid) errors.push(WorkoutErrors.timer);

  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  async function onSaveWorkout(): Promise<void> {
    setSubmitted(true);
    onCloseSaveWorkout();

    if (dateIsInvalid || timerIsInvalid) {
      setFormHasErrors(true);
      return;
    }

    // Client-side validation
    if (formHasErrors) {
      return;
    }

    // Try to write to DB
    try {
      await addWorkoutWithExercises({
        variables: {
          userUid: userUid ?? "",
          workoutWithExercises: state,
        },
      });
    } catch (err) {
      console.error("Error submitting workout with exercises: ", err);
    }
  }

  const [showServerError, setShowServerError] = useState<boolean>(true);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  useEffect(() => {
    if (state.exercises.length === 0) {
      setSubmitted(false);
    }
  }, [state.exercises.length]);

  if (loading) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  return (
    <Box m={["0.5rem 1rem 1rem 1rem", "1rem"]} w={["100%", "100%", "720px"]}>
      {/* DATE */}
      <HStack
        justifyContent={"space-between"}
        mb="0.75rem"
        h={["90px", "120px"]}
      >
        <FormControl
          isRequired
          isInvalid={submitted && !state.createdAt}
          h="100%"
          display="flex"
          flexDirection="column"
          justifyContent={"flex-end"}
        >
          <FormLabel fontSize={["sm", "lg"]}>
            <b>Workout Date</b>
          </FormLabel>
          <Input
            size={["sm", "lg"]}
            name="createdAt"
            type="date"
            bg="white"
            maxW="180px"
            value={state.createdAt}
            onChange={handleStateChange}
            border="1px solid grey"
            borderRadius={"5px"}
            m="0"
            focusBorderColor={theme.colors.green[300]}
          />
        </FormControl>

        {/* TIMER */}
        <VStack justifyContent={"flex-end"} alignItems={"center"}>
          <FormLabel fontSize={["sm", "lg"]} m="0px">
            <b>Elapsed Time</b>
          </FormLabel>
          <Timer
            seconds={state.elapsedSeconds}
            isActive={timerIsActive}
            setIsActive={setTimerIsActive}
            setTime={setTime}
            size="md"
          />
        </VStack>
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

      {/* ADD COMMENT & TRACK WORKOUT BUTTONS */}
      <HStack w="100%" justifyContent={"space-between"} mt="1rem">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setAddWorkoutComment((prev) => !prev)}
          textAlign="left"
          color="black"
          my="0.5rem"
        >
          {addWorkoutComment ? "Hide Comment" : "Add Comment"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowTracking((prev) => !prev)}
          textAlign="left"
          color="black"
          my="0.5rem"
        >
          {showTracking ? "Hide Workout Tracking" : "Track Workout"}
        </Button>
      </HStack>

      {/* WORKOUT COMMENT */}
      <FormControl mb="1rem">
        {addWorkoutComment && (
          <AddComment
            placeholderText="Add a Workout Comment"
            comment={state.comment}
            setComment={setComment}
          />
        )}
      </FormControl>

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
                  submitted={submitted}
                  setFormHasErrors={setFormHasErrors}
                  trackWorkout={showTracking}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      <Flex w="100%" justifyContent={"space-between"}>
        <Button
          variant="primary"
          onClick={handleAddExercise}
          leftIcon={<FaPlusCircle />}
        >
          Add Exercise
        </Button>
        {state.exercises.length > 0 && (
          <Button
            variant="secondary"
            leftIcon={<FaSave />}
            disabled={true}
            onClick={onOpenSaveWorkout}
          >
            Save Workout
          </Button>
        )}
      </Flex>

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
                {state.createdAt && (
                  <>
                    {dayjs(state.createdAt).format("dddd, MMMM DD, YYYY")}
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
