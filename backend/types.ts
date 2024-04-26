// TypeScript types for the backend.

export type User = {
  uid: String;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  isAuthorized: Boolean;
  createdAt: Number;
};

export type AddOrEditUserInput = Omit<
  User,
  "uid" | "isAuthorized" | "createdAt"
>;

export type UpdateUserArgs = { uid: String; edits: AddOrEditUserInput };

export type Workout = {
  uid: String;
  userUid: String;
  startTime: Number;
  endTime: Number;
  comment: String;
};

export type AddOrEditWorkoutInput = Omit<Workout, "uid" | "userUid">;

export type Exercise = {
  uid: String;
  workoutUid: String;
  title: String;
  weight: Number;
  weightUnit: String;
  sets: Number;
  reps: Number;
  repsDisplay: String;
  comment: String;
  startTime: Number;
  endTime: Number;
};

export type AddOrEditExerciseInput = Omit<Exercise, "uid" | "workoutUid">;
