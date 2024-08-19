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
    const { title, weight, weightUnit, startTime, endTime } = exercise;
    if (!title) {
      return {
        result: false,
        reason: `Exercise title is required. Received ${title}`,
      };
    }

    if (!weight) {
      return {
        result: false,
        reason: `Exercise weight is required. Received ${weight}`,
      };
    }

    if (!weightUnit) {
      return {
        result: false,
        reason: `Exercise weightUnit is required. Received ${weightUnit}`,
      };
    }

    if (startTime && endTime) {
      if (dayjs(startTime).isAfter(endTime)) {
        return {
          result: false,
          reason: `Exercise startTime must be before endTime. Received ${startTime} and ${endTime}`,
        };
      }
    }

    if (startTime && !endTime) {
      return {
        result: false,
        reason: `Exercise endTime is required when startTime is Provided. Received ${startTime} and ${endTime}`,
      };
    }

    if (!startTime && endTime) {
      return {
        result: false,
        reason: `Exercise startTime is required when endTime is Provided. Received ${startTime} and ${endTime}`,
      };
    }
  }

  return { result: true, reason: "No exercises errors detected." };
}
