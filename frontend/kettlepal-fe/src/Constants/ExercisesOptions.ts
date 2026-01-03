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

export const ResistanceOptions = [
  {
    value: "bodyWeight",
    label: "Body Weight",
  },
  {
    value: "weighted",
    label: "Weighted",
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

type FieldValue<T = string | number> = {
  value: T;
};
type ConfigurationFields = {
  weightUnit: FieldValue<string>;
  repsDisplay: FieldValue<string>;
  multiplier: FieldValue<number>;
  weight?: FieldValue<string>;
  isBodyWeight?: FieldValue<boolean>;
};

type PreconfigurationsType = Record<string, ConfigurationFields>;

export const GenericPreconfigurations: PreconfigurationsType = {
  Clean: {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "l/r" },
    multiplier: { value: 1.25 },
  },
  "Clean & Press": {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "l/r" },
    multiplier: { value: 1.75 },
  },
  Deadlift: {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "std" },
    multiplier: { value: 1 },
  },
  "Goblet Squat": {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "std" },
    multiplier: { value: 1.0 },
  },
  "Pull Up": {
    weightUnit: { value: "" },
    repsDisplay: { value: "std" },
    multiplier: { value: 0.95 },
    weight: { value: "" },
    isBodyWeight: { value: true },
  },
  "Push Up": {
    weightUnit: { value: "" },
    repsDisplay: { value: "std" },
    multiplier: { value: 0.3 },
    weight: { value: "" },
    isBodyWeight: { value: true },
  },
  "Pistol Squat": {
    weightUnit: { value: "" },
    repsDisplay: { value: "std" },
    multiplier: { value: 0.9 },
    weight: { value: "" },
    isBodyWeight: { value: true },
  },
  Press: {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "l/r" },
    multiplier: { value: 1.0 },
  },
  "Racked Squat": {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "l/r" },
    multiplier: { value: 1.0 },
  },
  "Single Arm Swing": {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "l/r" },
    multiplier: { value: 1.0 },
  },
  Snatch: {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "l/r" },
    multiplier: { value: 1.5 },
  },
  Swing: {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "std" },
    multiplier: { value: 1.0 },
  },
  "Turkish Get Up": {
    weightUnit: { value: "kg" },
    repsDisplay: { value: "std" },
    multiplier: { value: 4.0 },
  },
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

  const preconfigs: PreconfigurationsType = {};
  sortedTemplates.forEach((template) => {
    preconfigs[template.title] = {
      weightUnit: { value: template.weightUnit ?? "" },
      repsDisplay: { value: template.repsDisplay ?? "" },
      multiplier: { value: template.multiplier },
      weight: { value: "" },
      ...(template.isBodyWeight &&
        user?.bodyWeightUnit &&
        user.bodyWeight && {
          weight: { value: user.bodyWeight.toString() },
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
): PreconfigurationsType {
  const preconfigsFromTemplates = createPreconfigurationsFromTemplates(
    templates,
    {
      bodyWeight: user?.bodyWeight ?? 0,
      bodyWeightUnit: user?.bodyWeightUnit ?? "kg",
    }
  );

  const usingDefaultPreconfigs =
    Object.keys(preconfigsFromTemplates).length === 0;

  const preconfigs = usingDefaultPreconfigs
    ? GenericPreconfigurations
    : preconfigsFromTemplates;

  // If using default preconfigs, set weightUnit and weight for bodyWeightExercises
  if (usingDefaultPreconfigs) {
    Object.entries(preconfigs).forEach(
      ([_, config]: [string, ConfigurationFields]) => {
        if (config.weightUnit.value === "" && config.weight) {
          config.weight.value = user.bodyWeight.toString() ?? "0";
          config.weightUnit.value = user.bodyWeightUnit ?? "kg";
        }
      }
    );
  }

  return {
    ...preconfigs,
    ...(withCustom
      ? {}
      : {
          Custom: {
            weight: { value: "" },
            weightUnit: { value: "" },
            repsDisplay: { value: "" },
            multiplier: { value: 1.0 },
          },
        }),
  };
}
export default getConfigurations;
