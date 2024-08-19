import { AddOrEditWorkoutInput } from "../types";

export function verifyWorkout(workout: AddOrEditWorkoutInput): {
  result: boolean;
  reason: string;
} {
  // TODO: Verify Data before committing to DB
  return { result: true, reason: "TODO: write verifyWorkout function" };
}
