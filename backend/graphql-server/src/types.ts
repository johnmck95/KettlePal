// TypeScript types for the backend.

export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAuthorized: boolean;
  createdAt: string;
};

export type AddOrEditUserInput = Omit<
  User,
  "uid" | "isAuthorized" | "createdAt"
>;

export type UpdateUserArgs = { uid: string; edits: AddOrEditUserInput };

export type Workout = {
  uid: string;
  userUid: string;
  createdAt: string;
  elapsedSeconds: number;
  comment: string;
};

export type AddOrEditWorkoutInput = Omit<Workout, "uid" | "userUid">;

export type Exercise = {
  uid: string;
  workoutUid: string;
  title: string;
  weight: number;
  weightUnit: string;
  sets: string | number;
  reps: string | number;
  repsDisplay: string;
  comment: string;
  elapsedSeconds: number;
};

export type AddOrEditExerciseInput = Omit<Exercise, "uid" | "workoutUid">;

export type AddWorkoutWithExercisesInput = AddOrEditWorkoutInput & {
  exercises: AddOrEditExerciseInput[];
};
