import React, { useEffect, useState } from "react";
import { CreateWorkoutState } from "./CreateWorkout";
import {
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  Text,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  Box,
  useMediaQuery,
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

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  submitted,
  setFormHasErrors,
  trackWorkout,
}: {
  exercise: CreateWorkoutState["exercises"][number];
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: (index: number) => void;
  exerciseIndex: number;
  submitted: boolean;
  setFormHasErrors: (value: boolean) => void;
  trackWorkout: boolean;
}) {
  const [addExerciseComment, setAddExerciseComment] = useState<boolean>(false);
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

  enum ExerciseErrors {
    title = "Title is required.",
    weight = "Weight is required when Weight Unit is provided.",
    weightUnit = "Weight Unit is required when Weight is proivided.",
    sets = "Sets are required when Reps or Rep Type are provided.",
    reps = "Reps are required when Sets or Rep Type are provided.",
    repsDisplay = "Rep Type is required when Sets or Reps are provided.",
  }

  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (titleIsInvalid) errors.push(ExerciseErrors.title);
  if (weightIsInvalid) errors.push(ExerciseErrors.weight);
  if (weightUnitIsInvalid) errors.push(ExerciseErrors.weightUnit);
  if (setsIsInvalid) errors.push(ExerciseErrors.sets);
  if (repsIsInvalid) errors.push(ExerciseErrors.reps);
  if (repsDisplayIsInvalid) errors.push(ExerciseErrors.repsDisplay);

  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  function completedASet() {
    setCompletedSets((prev) => prev + 1);
    if (completedSets >= exercise.sets) {
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
    if (completedSets > exercise.sets) {
      setCompletedSets(exercise.sets);
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
            w="40%"
            isRequired
            isInvalid={submitted && titleIsInvalid}
          >
            <FormLabel size={["xs", "sm", "md"]}>Title</FormLabel>
            <Select
              size={["xs", "sm", "md"]}
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
          <FormControl w="21%" isInvalid={submitted && weightIsInvalid}>
            <FormLabel size={["xs", "", "md"]}>Weight</FormLabel>
            <Select
              size={["xs", "sm", "md"]}
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
          <FormControl w="18%" isInvalid={submitted && setsIsInvalid}>
            <FormLabel size={["xs", "sm", "md"]}>Sets</FormLabel>
            <NumberInput
              size={["xs", "sm", "md"]}
              step={1}
              defaultValue={0}
              min={0}
              max={50}
              name="sets"
              value={exercise.sets}
              onChange={(event) => handleExercise("sets", event, exerciseIndex)}
              color={
                !!exercise.sets ? theme.colors.black : theme.colors.grey[500]
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* REPS */}
          <FormControl w="18%" isInvalid={submitted && repsIsInvalid}>
            <FormLabel size={["xs", "sm", "md"]}>
              <Text>Reps</Text>
            </FormLabel>
            <NumberInput
              size={["xs", "sm", "md"]}
              step={1}
              defaultValue={0}
              min={0}
              max={50}
              name="reps"
              value={exercise.reps}
              onChange={(event) => handleExercise("reps", event, exerciseIndex)}
              color={
                !!exercise.reps ? theme.colors.black : theme.colors.grey[500]
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>

        {/* SEE DETAILS */}
        <HStack
          w="100%"
          justifyContent={seeDetails ? "space-between" : "flex-start"}
          alignItems="flex-start"
        >
          <Button
            fontSize={["xs", "sm"]}
            variant="link"
            onClick={() => setSeeDetails((prev) => !prev)}
            textAlign="left"
            mt="0.15rem"
            color={
              submitted && (weightUnitIsInvalid || repsDisplayIsInvalid)
                ? theme.colors.error
                : theme.colors.grey
            }
          >
            {seeDetails ? "Hide Details" : "See Details"}
          </Button>

          {seeDetails && (
            <HStack w="calc(100% - 85px)" justifyContent="flex-end">
              {/* WEIGHT UNIT */}
              <FormControl
                ml="1rem"
                w="50%"
                maxW="160px"
                isInvalid={submitted && weightUnitIsInvalid}
              >
                <FormLabel mb="0" fontSize={["xs", "sm", "md"]}>
                  Weight Unit
                </FormLabel>
                <Select
                  size={["xs", "sm", "md"]}
                  placeholder="Select Option"
                  name="weightUnit"
                  value={exercise.weightUnit}
                  onChange={(event) =>
                    handleExercise(
                      event.target.name,
                      event.target.value,
                      exerciseIndex
                    )
                  }
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

              {/* REPS DISPLAY */}
              <FormControl
                w="50%"
                maxW="160px"
                isInvalid={submitted && repsDisplayIsInvalid}
              >
                <FormLabel mb="0" fontSize={["xs", "sm", "md"]}>
                  Rep Type
                </FormLabel>
                <Select
                  size={["xs", "sm", "md"]}
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
            </HStack>
          )}
        </HStack>

        {/* COMMENT */}
        <Flex w="100%">
          <FormControl>
            <Button
              fontSize={["xs", "sm"]}
              variant="link"
              onClick={() => setAddExerciseComment((prev) => !prev)}
              mb={addExerciseComment ? "0.5rem" : "0.15rem"}
              textAlign="left"
              color={
                submitted && (weightUnitIsInvalid || repsDisplayIsInvalid)
                  ? theme.colors.error
                  : theme.colors.grey
              }
            >
              {addExerciseComment ? "Hide Comment" : "Add Comment"}
            </Button>

            {addExerciseComment && (
              <AddComment
                placeholderText="Add an Exercise Comment"
                comment={exercise.comment}
                setComment={setExerciseComment}
                maxWidth="100%"
              />
            )}
          </FormControl>
        </Flex>

        {/* SETS COMPLETED */}
        {trackWorkout && (
          <HStack justifyContent={"space-between"} w="100%">
            <FormLabel size={["sm", "md", "lg"]} my="auto">
              <b>{`Completed ${completedSets} / ${exercise.sets} Sets`}</b>
            </FormLabel>
            <HStack>
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
            </HStack>
          </HStack>
        )}

        {/* STOPWATCH */}

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
