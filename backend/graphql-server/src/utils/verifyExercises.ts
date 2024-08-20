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
  }

  return { result: true, reason: "No exercises errors detected." };
}
