const users = [
  { uid: "0", firstName: "John", lastName: "McKinnon" },
  { uid: "1", firstName: "Evan", lastName: "Blackwell" },
];

const workouts = [
  { uid: "10", date: "April 4", userUid: "0" },
  { uid: "11", date: "April 3", userUid: "1" },
];

const exercises = [
  { uid: "20", workoutUid: "10", title: "C&P" },
  { uid: "21", workoutUid: "10", title: "Swing" },
  { uid: "22", workoutUid: "11", title: "SA Swing" },
  { uid: "22", workoutUid: "11", title: "TGU" },
];

export default { users, workouts, exercises };
