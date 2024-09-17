export type ExerciseFromClient = {
  title: string;
  weight: string | number;
  weightUnit: string;
  sets: string | number;
  reps: string | number;
  repsDisplay: string;
  comment: string;
  elapsedSeconds: number;
};

export function verifyExercises(exercises: ExerciseFromClient[]): {
  result: boolean;
  reason: string;
} {
  if (exercises.length < 1) {
    return { result: false, reason: "At least 1 exercise is required." };
  }

  for (const exercise of exercises) {
    let {
      title,
      weight,
      sets: setsString,
      reps: repsString,
      repsDisplay,
      weightUnit,
      elapsedSeconds,
    } = exercise;
    // Frontend collects strings, but we store these values as floats in the DB.
    const reps = parseFloat(repsString as string);
    const sets = parseFloat(setsString as string);

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

    if (elapsedSeconds < 0 || typeof elapsedSeconds !== "number") {
      return {
        result: false,
        reason: `Exercise Elapsed Seconds must be a numerical value greater than or equal to 0.`,
      };
    }

    const validRepsDisplayed = [
      null,
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
