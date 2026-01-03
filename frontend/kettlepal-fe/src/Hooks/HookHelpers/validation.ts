export enum WorkoutErrorsMessages {
  date = "Please enter a workout date.",
  timer = "Please stop the workout timer before saving.",
  comment = "Comment cannot exceed 512 characters.",
}
export enum ExerciseErrorsMessages {
  title = "Title is required.",
  weight = "Weight is required when Unit is provided.",
  weightUnit = "Unit is required when Weight is proivided.",
  sets = "Sets are required when Reps, Type, Weight and/or Unit are provided.",
  reps = "Reps are required when Sets, Type, Weight and/or Unit are provided.",
  repsLrEven = "Reps must be an even number when Type is 'Left / Right'.",
  repsDisplay = "Type is required when Sets, Reps, Weight and/or Unit are provided.",
  multiplier = "Multiplier must be a realistic, positive number.",
  oneTwoLadder = "Reps must be 6 when Type is '(1,2)'.",
  oneThreeLadder = "Reps must be 12 when Type is '(1,2,3)'.",
  oneFourLadder = "Reps must be 20 when Type is '(1,2,3,4)'.",
  oneFiveLadder = "Reps must be 30 when Type is '(1,2,3,4,5)'.",
  comment = "Comment cannot exceed 512 characters.",
}

export type CreateOrUpdateWorkoutState = {
  date: { value: string; errors: string[] };
  comment: { value: string; errors: string[] };
  elapsedSeconds: { value: number; errors: string[] };
  exercises: Array<{
    title: { value: string; errors: string[] };
    weight: { value: string; errors: string[] };
    weightUnit: { value: string; errors: string[] };
    sets: { value: string; errors: string[] };
    reps: { value: string; errors: string[] };
    repsDisplay: { value: string; errors: string[] };
    comment: { value: string; errors: string[] };
    elapsedSeconds: { value: number; errors: string[] };
    multiplier: { value: number; errors: string[] };
    uid?: string;
    key?: string;
  }>;
};

export type ExerciseErrors = {
  title: string[];
  weight: string[];
  weightUnit: string[];
  sets: string[];
  reps: string[];
  repsDisplay: string[];
  comment: string[];
  elapsedSeconds: string[];
  multiplier: string[];
};

export type ValidationResult = {
  root: {
    date: string[];
    comment: string[];
    elapsedSeconds: string[];
  };
  exercises: ExerciseErrors[];
};

// Validate state for useCreateWorkoutForm.ts & useUpdateWorkoutWithExercisesForm.ts
export function validateState(
  state: CreateOrUpdateWorkoutState,
  timerIsActive: boolean
): ValidationResult {
  const result: ValidationResult = {
    root: {
      date: [],
      comment: [],
      elapsedSeconds: [],
    },
    exercises: state.exercises.map(() => ({
      title: [],
      weight: [],
      weightUnit: [],
      sets: [],
      reps: [],
      repsDisplay: [],
      comment: [],
      elapsedSeconds: [],
      multiplier: [],
    })),
  };
  // Workout-level validations
  if (!state.date.value) {
    result.root.date.push(WorkoutErrorsMessages.date);
  }
  if (timerIsActive) {
    result.root.elapsedSeconds.push(WorkoutErrorsMessages.timer);
  }
  if (state.comment.value.length > 512) {
    result.root.comment.push(WorkoutErrorsMessages.comment);
  }

  // Exercise-level validations
  state.exercises.forEach((e, i) => {
    if (!e.title.value.trim()) {
      result.exercises[i].title.push(ExerciseErrorsMessages.title);
    }
    if (!!e.weight.value === false && !!e.weightUnit.value === true) {
      result.exercises[i].weight.push(ExerciseErrorsMessages.weight);
    }
    if (!!e.weight.value === true && !!e.weightUnit.value === false) {
      result.exercises[i].weightUnit.push(ExerciseErrorsMessages.weightUnit);
    }
    if (
      (!!e.reps.value === true ||
        !!e.repsDisplay.value === true ||
        !!e.weight.value === true ||
        !!e.weightUnit.value === true) &&
      !!e.sets.value === false
    ) {
      result.exercises[i].sets.push(ExerciseErrorsMessages.sets);
    }
    if (
      (!!e.sets.value === true ||
        !!e.repsDisplay.value === true ||
        !!e.weight.value === true ||
        !!e.weightUnit.value === true) &&
      !!e.reps.value === false
    ) {
      result.exercises[i].reps.push(ExerciseErrorsMessages.reps);
    }
    if (
      !!e.reps.value === true &&
      e.repsDisplay.value === "l/r" &&
      Number(e.reps.value) % 2 !== 0
    ) {
      result.exercises[i].reps.push(ExerciseErrorsMessages.repsLrEven);
    }
    if (
      (!!e.reps.value === true ||
        !!e.sets.value === true ||
        !!e.weight.value === true ||
        !!e.weightUnit.value === true) &&
      !!e.repsDisplay.value === false
    ) {
      result.exercises[i].repsDisplay.push(ExerciseErrorsMessages.repsDisplay);
    }
    if (
      Number.isNaN(Number(e.multiplier.value)) ||
      Number(e.multiplier.value) < 0 ||
      Number(e.multiplier.value) > 100
    ) {
      result.exercises[i].multiplier.push(ExerciseErrorsMessages.multiplier);
    }
    if (
      !!e.reps.value === true &&
      e.repsDisplay.value === "(1,2)" &&
      Number(e.reps.value) !== 6
    ) {
      result.exercises[i].reps.push(ExerciseErrorsMessages.oneTwoLadder);
    }
    if (
      !!e.reps.value === true &&
      e.repsDisplay.value === "(1,2,3)" &&
      Number(e.reps.value) !== 12
    ) {
      result.exercises[i].reps.push(ExerciseErrorsMessages.oneThreeLadder);
    }
    if (
      !!e.reps.value === true &&
      e.repsDisplay.value === "(1,2,3,4)" &&
      Number(e.reps.value) !== 20
    ) {
      result.exercises[i].reps.push(ExerciseErrorsMessages.oneFourLadder);
    }
    if (
      !!e.reps.value === true &&
      e.repsDisplay.value === "(1,2,3,4,5)" &&
      Number(e.reps.value) !== 30
    ) {
      result.exercises[i].reps.push(ExerciseErrorsMessages.oneFiveLadder);
    }
    if (e.comment.value.length > 512) {
      result.exercises[i].comment.push(ExerciseErrorsMessages.comment);
    }
  });
  return result;
}
