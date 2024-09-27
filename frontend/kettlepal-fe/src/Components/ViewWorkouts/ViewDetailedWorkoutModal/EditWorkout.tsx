import { HStack, VStack, Box } from "@chakra-ui/react";
import WorkoutTimer from "../../NewWorkouts/FormComponents.tsx/Workout/WorkoutTimer";
import WorkoutComment from "../../NewWorkouts/FormComponents.tsx/Workout/WorkoutComment";
import WorkoutDate from "../../NewWorkouts/FormComponents.tsx/Workout/WorkoutDate";
import { ChangeEvent, useState } from "react";
import { CreateWorkoutState } from "../../NewWorkouts/CreateWorkout";
import { UserWithWorkoutsQuery } from "../../../generated/frontend-types";
import {
  formatDateForYYYYMMDD,
  postgresToDayJs,
} from "../../../utils/Time/time";

interface EditWorkoutProps {
  workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0];
  refetchPastWorkouts: () => void;
}

export default function EditWorkout({
  workoutWithExercises,
}: EditWorkoutProps) {
  const [submitted, setSubmitted] = useState(false);

  const { uid, elapsedSeconds, createdAt, comment } =
    workoutWithExercises ?? {};

  const [editableWorkout, setEditableWorkout] = useState<
    Pick<CreateWorkoutState, "createdAt" | "comment" | "elapsedSeconds">
  >({
    createdAt: formatDateForYYYYMMDD(postgresToDayJs(createdAt ?? "")) ?? "",
    comment: comment ?? "",
    elapsedSeconds: elapsedSeconds ?? 0,
  });

  function handleStateChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setEditableWorkout((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const setTime = (elapsedSeconds: number) => {
    setEditableWorkout((prevState) => ({
      ...prevState,
      elapsedSeconds,
    }));
  };

  const setComment = (newComment: string) => {
    setEditableWorkout((prevState) => ({
      ...prevState,
      comment: newComment,
    }));
  };

  return (
    <VStack w="100%">
      <HStack mt="2.5rem" w="100%">
        <WorkoutDate
          submitted={submitted}
          createdAt={editableWorkout.createdAt}
          handleStateChange={handleStateChange}
        />
        <Box w="150px">
          <WorkoutTimer
            elapsedSeconds={editableWorkout.elapsedSeconds}
            timerIsActive={false}
            handleTimerIsActive={null}
            setTime={setTime}
          />
        </Box>
      </HStack>

      <WorkoutComment
        addWorkoutComment={true}
        comment={editableWorkout.comment}
        showLabel={true}
        setComment={setComment}
      />
    </VStack>
  );
}
