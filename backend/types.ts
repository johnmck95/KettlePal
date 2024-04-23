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
