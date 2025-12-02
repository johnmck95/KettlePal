import { Template } from "../generated/frontend-types";

export const KettlbellWeightsKG = [
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "Custom",
];

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

export const GenericPreconfigurations: any = {
  Swing: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "std",
    },
    multiplier: {
      value: 1.0,
    },
  },
  "Single Arm Swing": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
    multiplier: {
      value: 1.0,
    },
  },
  Press: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
    multiplier: {
      value: 1.0,
    },
  },
  "Goblet Squat": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "std",
    },
    multiplier: {
      value: 1.0,
    },
  },
  "Racked Squat": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
    multiplier: {
      value: 1.0,
    },
  },
  Clean: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
    multiplier: {
      value: 1.0,
    },
  },
  "Clean & Press": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
    multiplier: {
      value: 1.0,
    },
  },
  "Turkish Get Up": {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "std",
    },
    multiplier: {
      value: 1.0,
    },
  },
  Snatch: {
    weightUnit: {
      value: "kg",
    },
    repsDisplay: {
      value: "l/r",
    },
    multiplier: {
      value: 1.0,
    },
  },
};

type Preconfigurations = {
  [title: string]: {
    weightUnit: { value: string };
    repsDisplay: { value: string };
    multiplier: { value: number };
    weight: { value: number };
  };
};

// Creates an array of exercise titles from templates or by default, sorted by index.
export function createExerciseTitles(
  templates: Omit<Template, "createdAt" | "uid" | "userUid">[],
  withCustom = true
) {
  const sortedTemplates = [...templates].sort((a, b) => a.index - b.index);

  if (withCustom) {
    return sortedTemplates?.length > 0
      ? [...sortedTemplates.map((t) => t.title), "Custom"]
      : [...Object.keys(GenericPreconfigurations), "Custom"];
  } else {
    return sortedTemplates?.length > 0
      ? [...sortedTemplates.map((t) => t.title)]
      : [...Object.keys(GenericPreconfigurations)];
  }
}

// Formats the templates into consumable JSON
function createPreconfigurationsFromTemplates(
  templates: Omit<Template, "createdAt" | "uid" | "userUid">[],
  user: { bodyWeight: number; bodyWeightUnit: string }
) {
  const sortedTemplates = [...templates].sort((a, b) => a.index - b.index);

  const preconfigs: Preconfigurations = {};
  sortedTemplates.forEach((template) => {
    preconfigs[template.title] = {
      weightUnit: { value: template.weightUnit ?? "" },
      repsDisplay: { value: template.repsDisplay ?? "" },
      multiplier: { value: template.multiplier },
      weight: { value: 1 },
      ...(template.isBodyWeight &&
        user?.bodyWeightUnit &&
        user.bodyWeight && {
          weight: { value: user.bodyWeight },
          weightUnit: { value: user.bodyWeightUnit },
        }),
    };
  });

  return preconfigs;
}

// Returns a JSON object that is used to pre-populate new exercise fields.
// If no templates are provided (sorted by index), returns generic preconfigurations.
export function getConfigurations(
  templates: Omit<Template, "createdAt" | "uid" | "userUid">[],
  user: { bodyWeight: number; bodyWeightUnit: string },
  withCustom = true
): Preconfigurations {
  const preconfigsFromTemplates = createPreconfigurationsFromTemplates(
    templates,
    {
      bodyWeight: user?.bodyWeight ?? 0,
      bodyWeightUnit: user?.bodyWeightUnit ?? "kg",
    }
  );

  const preconfigs =
    Object.keys(preconfigsFromTemplates).length > 0
      ? preconfigsFromTemplates
      : GenericPreconfigurations;

  return {
    ...preconfigs,
    ...(withCustom
      ? {}
      : {
          Custom: {
            weight: { value: 1.0 },
            weightUnit: { value: "" },
            repsDisplay: { value: "" },
            multiplier: { value: 1.0 },
          },
        }),
  };
}
export default getConfigurations;
