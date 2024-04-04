const users = [
  {
    uid: "0",
    first_name: "John",
    last_name: "McKinnon",
    email: "john.mic.mckinnon@gmail.com",
    password: "Password123!",
    is_authorized: true,
  },
  {
    uid: "1",
    first_name: "Evan",
    last_name: "Blackwell",
    email: "evan.blackwell26@gmail.com",
    password: "Password123!",
    is_authorized: false,
  },
];

const workouts = [
  {
    uid: "10",
    start_time: 1,
    end_time: 2,
    comment: "John's Workout",
    date: "April 4",
    user_uid: "0",
  },
  {
    uid: "11",
    start_time: 1,
    end_time: 2,
    comment: "Evan's Workout",
    date: "April 3",
    user_uid: "1",
  },
];

const exercises = [
  {
    uid: "20",
    workout_uid: "10",
    title: "C&P",
    weight: 24.0,
    weight_unit: "kg",
    sets: 10,
    reps: 20,
    reps_display: "L/R",
    comment: "",
    start_time: 1,
    end_time: 2,
  },
  {
    uid: "21",
    workout_uid: "10",
    title: "Swing",
    weight: 24.0,
    weight_unit: "kg",
    sets: 10,
    reps: 20,
    reps_display: "L/R",
    comment: "",
    start_time: 1,
    end_time: 2,
  },
  {
    uid: "22",
    workout_uid: "11",
    title: "SA Swing",
    weight: 24.0,
    weight_unit: "kg",
    sets: 10,
    reps: 20,
    reps_display: "L/R",
    comment: "",
    start_time: 1,
    end_time: 2,
  },
  {
    uid: "22",
    workout_uid: "11",
    title: "TGU",
    weight: 24.0,
    weight_unit: "kg",
    sets: 10,
    reps: 20,
    reps_display: "L/R",
    comment: "",
    start_time: 1,
    end_time: 2,
  },
];

export default { users, workouts, exercises };
