export const ExerciseTitles = [
  "Swing",
  "Single Arm Swing",
  "Press",
  "Pistol Squat",
  "Goblet Squat",
  "Racked Squat",
  "Turkish Get Up",
  "Snatch",
  "Clean",
  "Clean & Press",
  "Push Up",
  "Push Up - Offset",
  "Pull Up",
  "Chin Up",
  "Plank",
  "Barbell Deadlift",
  "Barbell Squat",
  "Bench Press",
  "Dumbbell Bench Press",
  "Dumbbell Overhead Press",
  "Custom",
];

export const KettlbellWeightsKG = ["14", "20", "24", "28", "32", "Custom"];

export const WeightOptions = [
  {
    value: "kg",
    label: "kg",
  },
  {
    value: "lb",
    label: "lb",
  },
];

export const RepsDisplayOptions = [
  {
    value: "std",
    label: "Standard",
  },
  {
    value: "l/r",
    label: "Left / Right",
  },
  {
    value: "(1,2,3,4,5)",
    label: "(1,2,3,4,5)",
  },
  {
    value: "(1,2,3,4)",
    label: "(1,2,3,4)",
  },
  {
    value: "(1,2,3)",
    label: "(1,2,3)",
  },
  {
    value: "(1,2)",
    label: "(1,2)",
  },
];

export const Preconfigurations: any = {
  Swing: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Single Arm Swing": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  Press: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  "Pistol Squat": {
    weightUnit: {
      value: "",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  "Goblet Squat": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Racked Squat": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  "Turkish Get Up": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "std",
    },
  },
  Snatch: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  Clean: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  "Clean & Press": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
  },
  "Push Up": {
    weightUnit: {
      value: "",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Push Up - Offset": {
    weightUnit: {
      value: "",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Pull Up": {
    weightUnit: {
      value: "",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Chin Up": {
    weightUnit: {
      value: "",
    },
    repsDisplay: {
      value: "std",
    },
  },
  Plank: {
    weightUnit: {
      value: "",
    },
    repsDisplay: {
      value: "",
    },
  },
  "Barbell Deadlift": {
    weightUnit: {
      value: "lb",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Barbell Squat": {
    weightUnit: {
      value: "lb",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Bench Press": {
    weightUnit: {
      value: "lb",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Dumbbell Bench Press": {
    weightUnit: {
      value: "lb",
    },
    repsDisplay: {
      value: "std",
    },
  },
  "Dumbbell Overhead Press": {
    weightUnit: {
      value: "lb",
    },
    repsDisplay: {
      value: "std",
    },
  },
};

export default ExerciseTitles;
