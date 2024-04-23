// TypeScript types for the backend.

export type User = {
  uid: String;
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  is_authorized: Boolean;
  created_at: Number;
};

export type AddOrEditUserInput = Omit<
  User,
  "uid" | "is_authorized" | "created_at"
>;

export type UpdateUserArgs = { uid: String; edits: AddOrEditUserInput };

export type Workout = {
  uid: String;
  user_uid: String;
  start_time: Number;
  end_time: Number;
  comment: String;
};

export type Exercise = {
  uid: String;
  workout_uid: String;
  title: String;
  weight: Number;
  weight_unit: String;
  sets: Number;
  reps: Number;
  reps_display: String;
  comment: String;
  start_time: Number;
  end_time: Number;
};

export type AddOrEditExerciseInput = Omit<Exercise, "uid">;
