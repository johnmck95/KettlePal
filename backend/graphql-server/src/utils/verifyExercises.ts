import { AddOrEditExerciseInput, AddOrEditWorkoutInput } from "../types";

export function verifyExercises(exercises: AddOrEditExerciseInput[]): {
  result: boolean;
  reason: string;
} {
  // TODO: Verify Data before committing to DB
  return { result: true, reason: "TODO: write verifyExercises function" };
}
