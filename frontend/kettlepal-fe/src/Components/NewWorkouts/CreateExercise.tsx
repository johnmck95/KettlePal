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
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import {
  ExerciseTitles,
  KettlbellWeightsKG,
  RepsDisplayOptions,
  WeightOptions,
} from "../../Constants/ExercisesOptions";
import { FaTimes } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import theme from "../../Constants/theme";

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  submitted,
  setFormHasErrors,
}: {
  exercise: CreateWorkoutState["exercises"][number];
  handleExercise: (name: string, value: any, index: number) => void;
  deleteExercise: (index: number) => void;
  exerciseIndex: number;
  submitted: boolean;
  setFormHasErrors: (value: boolean) => void;
}) {
  const [addExerciseComment, setAddExerciseComment] = useState<boolean>(false);
  const [seeDetails, setSeeDetails] = useState<boolean>(false);

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

  const errors: string[] = [];
  if (titleIsInvalid) errors.push(ExerciseErrors.title);
  if (weightIsInvalid) errors.push(ExerciseErrors.weight);
  if (weightUnitIsInvalid) errors.push(ExerciseErrors.weightUnit);
  if (setsIsInvalid) errors.push(ExerciseErrors.sets);
  if (repsIsInvalid) errors.push(ExerciseErrors.reps);
  if (repsDisplayIsInvalid) errors.push(ExerciseErrors.repsDisplay);

  useEffect(
    () => setFormHasErrors(errors.length > 0),
    [errors, setFormHasErrors]
  );

  return (
    <Box mb="1rem">
      <VStack
        w="calc(100%-0.5rem)"
        border="1px solid grey"
        borderRadius={"5px"}
        p="0.5rem"
        mb="0.5rem"
      >
        <HStack w="100%">
          {/* TITLE */}
          <FormControl
            w="40%"
            isRequired
            isInvalid={submitted && titleIsInvalid}
          >
            <FormLabel size={["xs", "sm", "md"]}>Title</FormLabel>
            <Select
              size={["xs", "sm", "md"]}
              placeholder="Select option"
              name="title"
              value={exercise.title}
              onChange={(event) =>
                handleExercise(
                  event.target.name,
                  event.target.value,
                  exerciseIndex
                )
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
              placeholder="Select option"
              name="weight"
              value={exercise.weight}
              onChange={(event) =>
                handleExercise(
                  event.target.name,
                  event.target.value,
                  exerciseIndex
                )
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
        <HStack w="100%" justifyContent={seeDetails ? "center" : "flex-start"}>
          <Button
            size="xs"
            variant="link"
            onClick={() => setSeeDetails((prev) => !prev)}
            textAlign="left"
            color={
              submitted && (weightUnitIsInvalid || repsDisplayIsInvalid)
                ? theme.colors.error
                : theme.colors.grey
            }
          >
            {seeDetails ? "Hide Details" : "See Details"}
          </Button>

          {seeDetails && (
            <HStack w="calc(100% - 85px)">
              {/* WEIGHT UNIT */}
              <FormControl
                ml="20%"
                w="35%"
                isInvalid={submitted && weightUnitIsInvalid}
              >
                <FormLabel fontSize="xs">Weight Unit</FormLabel>
                <Select
                  size="xs"
                  placeholder="Select option"
                  name="weightUnit"
                  value={exercise.weightUnit}
                  onChange={(event) =>
                    handleExercise(
                      event.target.name,
                      event.target.value,
                      exerciseIndex
                    )
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
                w="30%"
                isInvalid={submitted && repsDisplayIsInvalid}
              >
                <FormLabel fontSize="xs">Rep Type</FormLabel>
                <Select
                  size="xs"
                  placeholder="Select option"
                  name="repsDisplay"
                  value={exercise.repsDisplay}
                  onChange={(event) =>
                    handleExercise(
                      event.target.name,
                      event.target.value,
                      exerciseIndex
                    )
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
            <FormLabel
              as="button"
              variant="link"
              fontSize={["sm", "lg"]}
              onClick={() => setAddExerciseComment((prev) => !prev)}
            >
              {addExerciseComment ? "Hide Comment" : "Add Comment"}
            </FormLabel>
            {addExerciseComment && (
              <AddComment
                placeholderText="Add an Exercise Comment"
                comment={exercise.comment}
                setComment={setExerciseComment}
              />
            )}
          </FormControl>
          <IconButton
            variant="ghost"
            colorScheme={theme.colors.green[700]}
            aria-label="Send email"
            icon={<FaTimes />}
            size="xs"
            onClick={onOpenDeleteExercise}
          />
        </Flex>

        {/* SETS COMPLETED */}

        {/* STOPWATCH */}

        {/* DELETE EXERCISE MODAL */}
        <ConfirmModal
          isOpen={isOpenDeleteExercise}
          onClose={onCloseDeleteExercise}
          onConfirmation={onDeleteExercise}
          ModalTitle="Delete Exercise"
          ModalBodyText="Are you sure you would like to delete this Exercise? This cannot be undone."
          CloseText="Cancel"
          ProceedText="Delete"
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
