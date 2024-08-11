import React, { useState } from "react";
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
} from "@chakra-ui/react";
import AddComment from "../AddComment";
import {
  ExerciseTitles,
  KettlbellWeightsKG,
  RepsDisplayOptions,
  WeightOptions,
} from "../../Constants/ExercisesOptions";

export default function CreateExercise({
  exercise,
  handleExercise,
  exerciseIndex,
}: {
  exercise: CreateWorkoutState["exercises"][number];
  handleExercise: (name: string, value: any, index: number) => void;
  exerciseIndex: number;
}) {
  const [addExerciseComment, setAddExerciseComment] = useState<boolean>(false);
  const [seeDetails, setSeeDetails] = useState<boolean>(false);

  const setExerciseComment = (newComment: string) => {
    handleExercise("comment", newComment, exerciseIndex);
  };

  return (
    <VStack
      w="calc(100%-0.5rem)"
      border="1px solid grey"
      borderRadius={"5px"}
      p="0.5rem"
      mb="0.5rem"
    >
      <HStack w="100%">
        {/* TITLE */}
        <FormControl w="40%">
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
        <FormControl w="21%">
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
        <FormControl w="18%">
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
        <FormControl w="18%">
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
        >
          {seeDetails ? "Hide Details" : "See Details"}
        </Button>

        {seeDetails && (
          <HStack w="calc(100% - 85px)">
            {/* WEIGHT UNIT */}
            <FormControl ml="20%" w="35%">
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
            <FormControl w="30%">
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

      {/* SETS COMPLETED */}

      {/* STOPWATCH */}
    </VStack>
  );
}
