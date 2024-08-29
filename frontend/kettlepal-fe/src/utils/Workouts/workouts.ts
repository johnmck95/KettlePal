import { WorkoutWithExercises } from "../../Constants/types";

export function totalWorkoutWorkCapacity(
  workoutWithExercises: WorkoutWithExercises
): string {
  const exercisesInLB = workoutWithExercises.exercises.filter(
    (exercise) => exercise.weightUnit === "lb"
  );
  const exercisesInKG = workoutWithExercises.exercises.filter(
    (exercise) => exercise.weightUnit === "kg"
  );

  const computeWorkCapacity = (
    totalWorkCapacity: number,
    exercise: WorkoutWithExercises["exercises"][0]
  ) => totalWorkCapacity + exercise.sets * exercise.reps * exercise.weight;

  const totalLBWorkCapacity = exercisesInLB.reduce(computeWorkCapacity, 0);
  const totalKGWorkCapacity = exercisesInKG.reduce(computeWorkCapacity, 0);

  // Majority rules - show work capacity in the unit that is used most often
  if (exercisesInLB.length > exercisesInKG.length) {
    return `${Number(
      (totalLBWorkCapacity + totalKGWorkCapacity * 2.20462).toFixed(0)
    ).toLocaleString()} lb`;
  } else {
    return `${Number(
      (totalKGWorkCapacity + totalLBWorkCapacity * 0.453592).toFixed(0)
    ).toLocaleString()} kg`;
  }
}
