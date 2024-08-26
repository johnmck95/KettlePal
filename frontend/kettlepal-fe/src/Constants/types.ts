export type UserWithWorkouts = {
  user: {
    firstName: string;
    lastName: string;
    workouts: [
      {
        uid: string;
        comment: string;
        elapsedSeconds: number;
        createdAt: string;
        exercises: [
          {
            uid: string;
            title: string;
            weight: number;
            weightUnit: string;
            sets: number;
            reps: number;
            repsDisplay: string;
            comment: string;
            elapsedSeconds: number;
          }
        ];
      }
    ];
  };
};

export type WorkoutWithExercises = {
  uid: string;
  comment: string;
  elapsedSeconds: number | null;
  createdAt: string;
  exercises: [
    {
      uid: string;
      title: string;
      weight: number;
      weightUnit: string;
      sets: number;
      reps: number;
      repsDisplay: string;
      comment: string;
      elapsedSeconds: number | null;
    }
  ];
};

export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  isAuthorized: boolean;
  createdAt: number;
  // password is omitted here
};

export type Workout = {
  uid: string;
  userUid: string;
  elapsedSeconds: number | null;

  comment: string;
};

export type Exercise = {
  uid: string;
  workoutUid: string;
  title: string;
  weight: number;
  weightUnit: string;
  sets: number;
  reps: number;
  repsDisplay: string;
  comment: string;
  elapsedSeconds: number | null;
};
