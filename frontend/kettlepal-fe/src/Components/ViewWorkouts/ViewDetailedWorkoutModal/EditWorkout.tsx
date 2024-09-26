import { HStack, VStack } from "@chakra-ui/react";
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

  return (
    <VStack>
      <HStack>
        <WorkoutDate
          submitted={submitted}
          createdAt={editableWorkout.createdAt}
          handleStateChange={handleStateChange}
        />
        {/* <WorkoutTimer
          state={}
          timerIsActive={}
          handleTimerIsActive={}
          setTime={}
        />  */}
      </HStack>
      {/* <WorkoutComment addWorkoutComment={true} state={} setComment={} /> */}
    </VStack>
  );
}
