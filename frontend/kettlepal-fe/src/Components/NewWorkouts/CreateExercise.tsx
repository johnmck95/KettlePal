import React, { useCallback, useEffect, useState } from "react";
import { CreateWorkoutState } from "./CreateWorkout";
import {
  FormControl,
  FormLabel,
  HStack,
  Text,
  Select,
  VStack,
  Button,
  IconButton,
  useDisclosure,
  Box,
  useMediaQuery,
  Input,
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import {
  ExerciseTitles,
  KettlbellWeightsKG,
  RepsDisplayOptions,
  WeightOptions,
} from "../../Constants/ExercisesOptions";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import theme from "../../Constants/theme";
import Timer from "../Timer";

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  submitted,
  setFormHasErrors,
  trackWorkout,
}: {
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  submitted: boolean;
  setFormHasErrors: (value: boolean) => void;
  trackWorkout: boolean;
}) {
  const [seeDetails, setSeeDetails] = useState<boolean>(false);
  const [completedSets, setCompletedSets] = useState<number>(0);

  // TODO: Session storage for completedSets works, but the exercise data isn't being saved.
  // Migrate all of the workout + exercise to be saved in session storage before turning this on.
  // const [completedSets, setCompletedSets] = useState<number>(() => {
  //   const sessionVal = sessionStorage.getItem(`completedSets-${exerciseIndex}`);
  //   return sessionVal ? parseInt(sessionVal) : 0;
  // });

  const setExerciseComment = (newComment: string) => {
    handleExercise("comment", newComment, exerciseIndex);
  };

  // Delete Exercise Modal Controls
  const {
    isOpen: isOpenDeleteExercise,
    onOpen: onOpenDeleteExercise,
    onClose: onCloseDeleteExercise,
  } = useDisclosure();

  function onDeleteExercise(): void {
    deleteExercise(exerciseIndex);
    onCloseDeleteExercise();
    setOffset(
      parseInt(
        `${
          !!swipeDistance() && swipeDistance() > minSwipeDistance
            ? swipeDistance()
            : offset
        }px`
      )
    );
  }

  const [timerIsActive, setTimerIsActive] = useState(false);
  const setTime = useCallback(
    (elapsedSeconds: number) => {
      handleExercise("elapsedSeconds", elapsedSeconds, exerciseIndex);
    },
    [exerciseIndex, handleExercise]
  );

  // Update exercise timer every 1s
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (timerIsActive) {
      interval = setInterval(() => {
        setTime(exercise.elapsedSeconds + 1);
      }, 1000);
    } else if (!timerIsActive && exercise.elapsedSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, exercise.elapsedSeconds, setTime]);

  const titleIsInvalid = !exercise.title;
  const weightIsInvalid =
    !!exercise.weight === false && !!exercise.weightUnit === true;
  const weightUnitIsInvalid =
    !!exercise.weight === true && !!exercise.weightUnit === false;
  const setsIsInvalid =
    (!!exercise.reps === true || !!exercise.repsDisplay === true) &&
    !!exercise.sets === false;
  const repsIsInvalid =
    (!!exercise.sets === true || !!exercise.repsDisplay === true) &&
    !!exercise.reps === false;
  const repsDisplayIsInvalid =
    (!!exercise.reps === true || !!exercise.sets === true) &&
    !!exercise.repsDisplay === false;
  const timerIsInvalid = timerIsActive;

  enum ExerciseErrors {
    title = "Title is required.",
    weight = "Weight is required when Weight Unit is provided.",
    weightUnit = "Weight Unit is required when Weight is proivided.",
    sets = "Sets are required when Reps or Rep Type are provided.",
    reps = "Reps are required when Sets or Rep Type are provided.",
    repsDisplay = "Rep Type is required when Sets or Reps are provided.",
    timer = "Please stop the exercise timer before saving.",
  }

  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (titleIsInvalid) errors.push(ExerciseErrors.title);
  if (weightIsInvalid) errors.push(ExerciseErrors.weight);
  if (weightUnitIsInvalid) errors.push(ExerciseErrors.weightUnit);
  if (setsIsInvalid) errors.push(ExerciseErrors.sets);
  if (repsIsInvalid) errors.push(ExerciseErrors.reps);
  if (repsDisplayIsInvalid) errors.push(ExerciseErrors.repsDisplay);
  if (timerIsInvalid) errors.push(ExerciseErrors.timer);

  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  function completedASet() {
    setCompletedSets((prev) => prev + 1);
    if (exercise.sets === "") {
      handleExercise("sets", "1", exerciseIndex);
    } else if (completedSets >= parseInt(exercise.sets)) {
      handleExercise("sets", completedSets + 1, exerciseIndex);
    }
    // TODO: Session storage for completedSets works, but the exercise data isn't being saved.
    // Migrate all of the workout + exercise to be saved in session storage before turning this on.
    // sessionStorage.setItem(
    //   `completedSets-${exerciseIndex}`,
    //   completedSets.toString()
    // );
  }
  function removedASet() {
    if (completedSets === 0) {
      return;
    }
    setCompletedSets((prev) => prev - 1);
    // TODO: Session storage for completedSets works, but the exercise data isn't being saved.
    // Migrate all of the workout + exercise to be saved in session storage before turning this on.
    // sessionStorage.setItem(
    //   `completedSets-${exerciseIndex}`,
    //   completedSets.toString()
    // );
  }

  useEffect(() => {
    if (completedSets > parseInt(exercise.sets)) {
      setCompletedSets(parseInt(exercise.sets));
    }
  }, [exercise.sets, completedSets, setCompletedSets]);

  /** SWIPE LOGIC **/
  const [isMobile] = useMediaQuery("(max-width: 420px)");
  const [offset, setOffset] = useState<number>(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const swipeDistance = () => {
    if (!touchStart || !touchEnd) {
      return 0;
    }
    return touchStart - touchEnd;
  };

  const onTouchStart = (e: any) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    const distance = swipeDistance();
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) {
      onOpenDeleteExercise();
      setOffset(distance);
    }
  };

  const customOnCloseDeleteExercise = () => {
    setOffset(0);
    onCloseDeleteExercise();
  };

  return (
    <Box mb="1rem" position="relative">
      <VStack
        w={`calc(100%-0.5rem + ${swipeDistance()})`}
        borderRadius={"5px"}
        p={["0.5rem", "1rem", "1.5rem"]}
        mb="0.5rem"
        boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
        bg="white"
        position="relative"
        transition="right 0.4s ease-in-out"
        right={`${
          !!swipeDistance() && swipeDistance() > minSwipeDistance
            ? swipeDistance()
            : offset
        }px`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!isMobile && (
          <IconButton
            variant="closeX"
            aria-label="Delete Exercise"
            icon={<FaTimes />}
            size="sm"
            onClick={onOpenDeleteExercise}
            position="absolute"
            right="1px"
            top="1px"
          />
        )}
        <HStack w="100%" mb="0.25rem">
          {/* TITLE */}
          <FormControl
            w="50%"
            isRequired
            isInvalid={submitted && titleIsInvalid}
          >
            <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
              Title
            </FormLabel>
            <Select
              size={["sm", "sm", "md"]}
              fontSize={["12px", "14px", "16px"]}
              placeholder="Select Option"
              name="title"
              value={exercise.title}
              onChange={(event) =>
                handleExercise(
                  event.target.name,
                  event.target.value,
                  exerciseIndex
                )
              }
              focusBorderColor={theme.colors.green[300]}
              color={
                !!exercise.title ? theme.colors.black : theme.colors.grey[500]
              }
            >
              {ExerciseTitles.map((title) => {
                return (
                  <option key={title} value={title}>
                    {title}
                  </option>
                );
              })}
            </Select>
          </FormControl>

          {/* WEIGHT */}
          <FormControl w="23%" isInvalid={submitted && weightIsInvalid}>
            <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
              Weight
            </FormLabel>
            <Select
              size={["sm", "sm", "md"]}
              fontSize={["12px", "14px", "16px"]}
              placeholder="Select Option"
              name="weight"
              value={exercise.weight}
              onChange={(event) =>
                handleExercise(
                  event.target.name,
                  event.target.value,
                  exerciseIndex
                )
              }
              focusBorderColor={theme.colors.green[300]}
              color={
                !!exercise.weight ? theme.colors.black : theme.colors.grey[500]
              }
            >
              {KettlbellWeightsKG.map((weight) => {
                return (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                );
              })}
            </Select>
          </FormControl>

          {/* SETS */}
          <FormControl w="15%" isInvalid={submitted && setsIsInvalid}>
            <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
              Sets
            </FormLabel>
            <Input
              size={["sm", "sm", "md"]}
              fontSize={["12px", "14px", "16px"]}
              placeholder="0"
              autoComplete="off"
              type="number"
              name="sets"
              value={exercise.sets}
              onChange={(event) =>
                handleExercise("sets", event.target.value, exerciseIndex)
              }
              focusBorderColor={theme.colors.green[300]}
              color={
                !!exercise.sets ? theme.colors.black : theme.colors.grey[500]
              }
            />
          </FormControl>

          {/* REPS */}
          <FormControl w="15%" isInvalid={submitted && repsIsInvalid}>
            <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
              <Text>Reps</Text>
            </FormLabel>
            <Input
              fontSize={["12px", "14px", "16px"]}
              size={["sm", "sm", "md"]}
              type="number"
              name="reps"
              placeholder="0"
              value={exercise.reps}
              onChange={(event) =>
                handleExercise("reps", event.target.value, exerciseIndex)
              }
              focusBorderColor={theme.colors.green[300]}
              color={
                !!exercise.reps ? theme.colors.black : theme.colors.grey[500]
              }
            />
          </FormControl>
        </HStack>

        {/* SEE DETAILS */}
        <Button
          fontSize={[12, 14, 16]}
          alignSelf={"flex-start"}
          size={["xs", "sm", "md"]}
          variant="secondary"
          onClick={() => setSeeDetails((prev) => !prev)}
          textAlign="left"
          color={
            submitted &&
            (weightUnitIsInvalid || repsDisplayIsInvalid || timerIsInvalid)
              ? theme.colors.error
              : theme.colors.grey
          }
        >
          {seeDetails ? "Hide Details" : "More Details"}
        </Button>
        <HStack
          w="100%"
          justifyContent={seeDetails ? "space-between" : "flex-start"}
          alignItems="flex-start"
        >
          {seeDetails && (
            <HStack
              w="100%"
              justifyContent="space-between"
              alignItems="flex-end"
              mt="-0.75rem"
            >
              <HStack>
                {/* REPS DISPLAY */}
                <FormControl
                  minWidth="70px"
                  maxWidth={["90px", "110px", "130px"]}
                  isInvalid={submitted && repsDisplayIsInvalid}
                >
                  <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
                    Rep Type
                  </FormLabel>
                  <Select
                    fontSize={["12px", "14px", "16px"]}
                    size={["sm", "sm", "md"]}
                    placeholder="Select Option"
                    name="repsDisplay"
                    value={exercise.repsDisplay}
                    onChange={(event) =>
                      handleExercise(
                        event.target.name,
                        event.target.value,
                        exerciseIndex
                      )
                    }
                    focusBorderColor={theme.colors.green[300]}
                    color={
                      !!exercise.repsDisplay
                        ? theme.colors.black
                        : theme.colors.grey[500]
                    }
                  >
                    {RepsDisplayOptions.map((option) => {
                      return (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* WEIGHT UNIT */}
                <FormControl
                  minWidth="50px"
                  maxWidth={["90px", "110px", "130px"]}
                  isInvalid={submitted && weightUnitIsInvalid}
                >
                  <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
                    Weight Unit
                  </FormLabel>
                  <Select
                    fontSize={["12px", "14px", "16px"]}
                    size={["sm", "sm", "md"]}
                    placeholder="Select Option"
                    name="weightUnit"
                    maxWidth="150px"
                    value={exercise.weightUnit}
                    onChange={(event) =>
                      handleExercise(
                        event.target.name,
                        event.target.value,
                        exerciseIndex
                      )
                    }
                    focusBorderColor={theme.colors.green[300]}
                    color={
                      !!exercise.weightUnit
                        ? theme.colors.black
                        : theme.colors.grey[500]
                    }
                  >
                    {WeightOptions.map((option) => {
                      return (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </HStack>

              {/* EXERCISE TIMER */}
              <VStack
                justifyContent={"flex-end"}
                alignItems={"center"}
                minWidth="130px"
                spacing={0}
              >
                <FormLabel fontSize={["12px", "14px", "16px"]} m="0">
                  Elapsed Time
                </FormLabel>
                <Timer
                  seconds={exercise.elapsedSeconds}
                  isActive={timerIsActive}
                  setIsActive={setTimerIsActive}
                  setTime={setTime}
                  size="sm"
                  variant="digital"
                />
              </VStack>
            </HStack>
          )}
        </HStack>

        {/* EXERCISE COMMENT */}
        {seeDetails && (
          <AddComment
            placeholderText="Add an Exercise Comment"
            comment={exercise.comment}
            setComment={setExerciseComment}
            maxWidth="100%"
          />
        )}

        {/* SETS COMPLETED */}
        {trackWorkout && (
          <HStack justifyContent={"space-between"} w="100%">
            <FormLabel size={["sm", "md", "lg"]} my="auto">
              <b>{`Completed ${completedSets} / ${
                exercise.sets === "" ? "0" : exercise.sets
              } Sets`}</b>
            </FormLabel>
            <HStack>
              <IconButton
                aria-label="Subtract Set"
                icon={<FaMinus />}
                size={["sm"]}
                color={theme.colors.white}
                bg={
                  completedSets === 0
                    ? theme.colors.grey[500]
                    : theme.colors.bole[500]
                }
                _hover={{
                  bg:
                    completedSets === 0
                      ? theme.colors.grey[500]
                      : theme.colors.bole[500],
                }}
                _active={{
                  bg:
                    completedSets === 0
                      ? theme.colors.grey[500]
                      : theme.colors.bole[600],
                }}
                onClick={removedASet}
              />
              <IconButton
                aria-label="Add Set"
                icon={<FaPlus />}
                size={["sm"]}
                color={theme.colors.white}
                bg={theme.colors.feldgrau[400]}
                _hover={{ bg: theme.colors.feldgrau[500] }}
                _active={{ bg: theme.colors.feldgrau[600] }}
                onClick={completedASet}
              />
            </HStack>
          </HStack>
        )}

        {/* DELETE EXERCISE MODAL */}
        <ConfirmModal
          isOpen={isOpenDeleteExercise}
          onClose={customOnCloseDeleteExercise}
          onConfirmation={onDeleteExercise}
          ModalTitle="Delete Exercise"
          ModalBodyText="Are you sure you would like to delete this Exercise? This cannot be undone."
          CloseText="Cancel"
          ProceedText="Delete"
          variant="warn"
        />
      </VStack>

      {/* ERROR MESSAGES */}
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
  );
}
