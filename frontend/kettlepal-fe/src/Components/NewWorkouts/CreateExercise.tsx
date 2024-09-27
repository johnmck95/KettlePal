import React, { useCallback, useEffect, useState } from "react";

import { HStack, Button, useDisclosure } from "@chakra-ui/react";
import AddComment from "./FormComponents.tsx/Generic/AddComment";
import {
  ExerciseTitles,
  KettlbellWeightsKG,
} from "../../Constants/ExercisesOptions";
import ConfirmModal from "../ConfirmModal";
import theme from "../../Constants/theme";
import ExerciseTitle from "./FormComponents.tsx/Exercise/ExerciseTitle";
import ExerciseWeight from "./FormComponents.tsx/Exercise/ExerciseWeight";
import ExerciseSets from "./FormComponents.tsx/Exercise/ExerciseSets";
import ExerciseReps from "./FormComponents.tsx/Exercise/ExerciseReps";
import ExerciseRepsDisplay from "./FormComponents.tsx/Exercise/ExerciseRepsDisplay";
import ExerciseWeightUnit from "./FormComponents.tsx/Exercise/ExerciseWeightUnit";
import ExerciseTimer from "./FormComponents.tsx/Exercise/ExerciseTimer";
import TrackExercise from "./FormComponents.tsx/MidWorkoutTracking/TrackExercise";
import { ExerciseContainer } from "./FormComponents.tsx/Exercise/ExerciseContainer";
import { CreateWorkoutState } from "../../Hooks/useCreateWorkoutForm";

interface CreateExerciseProps {
  exercise: Omit<CreateWorkoutState["exercises"][number], "key">;
  handleExercise: (name: string, value: string | number, index: number) => void;
  deleteExercise: ((index: number) => void) | (() => Promise<void>);
  exerciseIndex: number;
  submitted: boolean;
  setFormHasErrors: (value: boolean) => void;
  trackWorkout: boolean;
  mutatingWorkout?: boolean;
}

export default function CreateExercise({
  exercise,
  handleExercise,
  deleteExercise,
  exerciseIndex,
  submitted,
  setFormHasErrors,
  trackWorkout,
  mutatingWorkout,
}: CreateExerciseProps) {
  const SESSION_STORAGE_KEY = `completedSets-${exerciseIndex}`;
  const EXERCISE_TIMER_KEY = `exerciseTimerIsActive-${exerciseIndex}`;

  const [completedSets, setCompletedSets] = useState<number>(() => {
    const sessionVal = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return sessionVal ? parseInt(sessionVal) : 0;
  });
  const [seeDetails, setSeeDetails] = useState<boolean>(false);
  const [timerIsActive, setTimerIsActive] = useState(() => {
    const fromStorage = sessionStorage.getItem(EXERCISE_TIMER_KEY);
    return fromStorage ? true : false;
  });
  const [customTitle, setCustomTitle] = useState(
    exercise.title !== "" && !ExerciseTitles.includes(exercise.title)
  );
  const [customWeight, setCustomWeight] = useState(
    exercise.weight !== "" && !KettlbellWeightsKG.includes(exercise.weight)
  );

  const handleTimerIsActive = (newState: boolean) => {
    setTimerIsActive(newState);
    if (newState) {
      sessionStorage.setItem(EXERCISE_TIMER_KEY, "true");
    } else {
      sessionStorage.removeItem(EXERCISE_TIMER_KEY);
    }
  };
  const setExerciseComment = (newComment: string) => {
    handleExercise("comment", newComment, exerciseIndex);
  };

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

  // ERROR VALIDATION
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

  // Keep track of completed sets in session storage
  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, completedSets.toString());
  }, [completedSets, SESSION_STORAGE_KEY]);

  function completedASet() {
    setCompletedSets((prev) => prev + 1);
    if (exercise.sets === "") {
      handleExercise("sets", "1", exerciseIndex);
    } else if (completedSets >= parseInt(exercise.sets)) {
      handleExercise("sets", (completedSets + 1).toString(), exerciseIndex);
    }
  }
  function removedASet() {
    if (completedSets === 0) {
      return;
    }
    setCompletedSets((prev) => prev - 1);
  }

  // Bump the number of sets if your go above the limt while tracking
  useEffect(() => {
    if (completedSets > parseInt(exercise.sets)) {
      setCompletedSets(parseInt(exercise.sets));
    }
  }, [exercise.sets, completedSets, setCompletedSets]);

  /** SWIPE LOGIC **/
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

  // Delete Exercise Modal Controls
  const {
    isOpen: isOpenDeleteExercise,
    onOpen: onOpenDeleteExercise,
    onClose: onCloseDeleteExercise,
  } = useDisclosure();

  return (
    <ExerciseContainer
      errors={errors}
      submitted={submitted}
      offset={offset}
      setOffset={setOffset}
      minSwipeDistance={minSwipeDistance}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      swipeDistance={swipeDistance}
      onOpenDeleteExercise={onOpenDeleteExercise}
    >
      <HStack w="100%" mb="0.25rem">
        {/* TITLE */}
        <ExerciseTitle
          submitted={submitted}
          titleIsInvalid={titleIsInvalid}
          customTitle={customTitle}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          setCustomTitle={setCustomTitle}
          handleExercise={handleExercise}
        />

        {/* WEIGHT */}
        <ExerciseWeight
          submitted={submitted}
          weightIsInvalid={weightIsInvalid}
          customWeight={customWeight}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          setCustomWeight={setCustomWeight}
          handleExercise={handleExercise}
        />

        {/* SETS */}
        <ExerciseSets
          submitted={submitted}
          setsIsInvalid={setsIsInvalid}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          handleExercise={handleExercise}
        />

        {/* REPS */}
        <ExerciseReps
          submitted={submitted}
          repsIsInvalid={repsIsInvalid}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          handleExercise={handleExercise}
        />
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
          !seeDetails &&
          (weightUnitIsInvalid || repsDisplayIsInvalid || timerIsInvalid)
            ? theme.colors.error
            : theme.colors.feldgrau[700]
        }
        sx={{
          _focus: {
            borderColor: theme.colors.green[300],
            boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
          },
        }}
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
            mt={mutatingWorkout ? 0 : "-0.75rem"}
          >
            <HStack>
              {/* REPS DISPLAY */}
              <ExerciseRepsDisplay
                submitted={submitted}
                repsDisplayIsInvalid={repsDisplayIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />

              {/* WEIGHT UNIT */}
              <ExerciseWeightUnit
                submitted={submitted}
                weightUnitIsInvalid={weightUnitIsInvalid}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                handleExercise={handleExercise}
              />
            </HStack>

            {/* EXERCISE TIMER */}
            <ExerciseTimer
              exercise={exercise}
              timerIsActive={timerIsActive}
              handleTimerIsActive={mutatingWorkout ? null : handleTimerIsActive}
              setTime={setTime}
            />
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
      <TrackExercise
        trackWorkout={trackWorkout}
        completedSets={completedSets}
        exercise={exercise}
        removedASet={removedASet}
        completedASet={completedASet}
      />

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
    </ExerciseContainer>
  );
}
