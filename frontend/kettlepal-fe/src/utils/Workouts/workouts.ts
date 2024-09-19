import { UserWithWorkoutsQuery } from "../../generated/frontend-types";

type Exercise = NonNullable<
  NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"][0]
  >["exercises"]
>[0];
export function totalWorkoutWorkCapacity(
  workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0]
): string {
  const exercisesInLB = workoutWithExercises?.exercises?.filter(
    (exercise) => exercise.weightUnit === "lb"
  );
  const exercisesInKG = workoutWithExercises?.exercises?.filter(
    (exercise) => exercise.weightUnit === "kg"
  );

  const computeWorkCapacity = (totalWorkCapacity: number, exercise: Exercise) =>
    totalWorkCapacity +
    (exercise?.sets ?? 0) * (exercise?.reps ?? 0) * (exercise?.weight ?? 0);

  const totalLBWorkCapacity = exercisesInLB
    ? exercisesInLB.reduce(computeWorkCapacity, 0)
    : 0;
  const totalKGWorkCapacity = exercisesInKG
    ? exercisesInKG.reduce(computeWorkCapacity, 0)
    : 0;

  // Majority rules - show work capacity in the unit that is used most often
  if ((exercisesInLB?.length ?? 0) > (exercisesInKG?.length ?? 0)) {
    return `${Number(
      (totalLBWorkCapacity + totalKGWorkCapacity * 2.20462).toFixed(0)
    ).toLocaleString()} lb`;
  } else {
    return `${Number(
      (totalKGWorkCapacity + totalLBWorkCapacity * 0.453592).toFixed(0)
    ).toLocaleString()} kg`;
  }
}
