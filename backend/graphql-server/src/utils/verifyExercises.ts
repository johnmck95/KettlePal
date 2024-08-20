import dayjs from "dayjs";
import { AddOrEditExerciseInput, AddOrEditWorkoutInput } from "../types";

export function verifyExercises(exercises: AddOrEditExerciseInput[]): {
  result: boolean;
  reason: string;
} {
  if (exercises.length < 1) {
    return { result: false, reason: "At least 1 exercise is required." };
  }

  for (const exercise of exercises) {
    const {
      title,
      weight,
      sets,
      reps,
      repsDisplay,
      weightUnit,
      startTime,
      endTime,
    } = exercise;

    if (!title) {
      return {
        result: false,
        reason: `Exercise title is required. Received '${title}'.`,
      };
    }

    if (!reps && (sets || repsDisplay)) {
      return {
        result: false,
        reason: `Exercise Reps is required when Sets or Reps Display is provided.`,
      };
    }

    if (!sets && (reps || repsDisplay)) {
      return {
        result: false,
        reason: `Exercise Sets is required when Reps or Reps Display is provided`,
      };
    }

    if (!repsDisplay && (sets || reps)) {
      return {
        result: false,
        reason: `Exercise Reps Display is required when Sets or Reps are provided.`,
      };
    }

    if (weight && !weightUnit) {
      return {
        result: false,
        reason: `Exercise Weight Unit is required when Weight is provided`,
      };
    }

    if (!weight && weightUnit) {
      return {
        result: false,
        reason: `Exercise Weight is required when Weight Unit is provided.`,
      };
    }

    if (startTime && endTime) {
      if (dayjs(startTime).isAfter(endTime)) {
        return {
          result: false,
          reason: `Exercise Start Time must be before End Time.`,
        };
      }
    }

    if (startTime && !endTime) {
      return {
        result: false,
        reason: `Exercise End Time is required when Start Time is Provided.`,
      };
    }

    if (!startTime && endTime) {
      return {
        result: false,
        reason: `Exercise Start Time is required when End Time is Provided.`,
      };
    }

    const validRepsDisplayed = [
      "",
      "l/r",
      "std",
      "(1,2)",
      "(1,2,3)",
      "(1,2,3,4)",
      "(1,2,3,4,5)",
    ];
    if (!validRepsDisplayed.includes(repsDisplay)) {
      return {
        result: false,
        reason: `Exercise Reps Display must be one of ${validRepsDisplayed.join(
          ", "
        )}.`,
      };
    }

    if (repsDisplay === "l/r" && reps % 2 !== 0) {
      return {
        result: false,
        reason: `Exercise Reps must be even when Reps Display is 'l/r'.`,
      };
    }

    if (repsDisplay === "(1,2)" && reps !== 6) {
      return {
        result: false,
        reason: `Exercise Reps must be 6 when Reps Display is '(1,2)'.`,
      };
    }

    if (repsDisplay === "(1,2,3)" && reps !== 12) {
      return {
        result: false,
        reason: `Exercise Reps must be 12 when Reps Display is '(1,2,3)'.`,
      };
    }

    if (repsDisplay === "(1,2,3,4)" && reps !== 20) {
      return {
        result: false,
        reason: `Exercise Reps must be 20 when Reps Display is '(1,2,3,4)'.`,
      };
    }

    if (repsDisplay === "(1,2,3,4,5)" && reps !== 30) {
      return {
        result: false,
        reason: `Exercise Reps must be 30 when Reps Display is '(1,2,3,4,5)'.`,
      };
    }
  }

  return { result: true, reason: "No exercises errors detected." };
}
