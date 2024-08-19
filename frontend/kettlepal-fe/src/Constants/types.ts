export type UserWithWorkouts = {
  user: {
    firstName: string;
    lastName: string;
    workouts: [
      {
        uid: string;
        comment: string;
        startTime: string;
        endTime: string;
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
            startTime: string;
            endTime: string;
          }
        ];
      }
    ];
  };
};

export type WorkoutWithExercises = {
  uid: string;
  comment: string;
  startTime: string | null;
  endTime: string | null;
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
      startTime: string | null;
      endTime: string | null;
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
  startTime: string;
  endTime: string;
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
  startTime: string | null;
  endTime: string | null;
};
