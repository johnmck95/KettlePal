import {
  AddOrUpdateSettingsInput,
  AddOrUpdateTemplateInput,
} from "../generated/backend-types.js";
import { validRepsDisplayed } from "./verifyExercises.js";

export function verifyUserSettings(
  settings: Omit<AddOrUpdateSettingsInput, "templates">
): {
  result: boolean;
  reason: string;
} {
  // check bodyWeightUnit is "kg" "lb" or undefined
  if (
    typeof settings.bodyWeightUnit === "string" &&
    settings.bodyWeightUnit !== "kg" &&
    settings.bodyWeightUnit !== "lb"
  ) {
    return {
      result: false,
      reason: "bodyWeightUnit must be 'kg', 'lb' or null.",
    };
  }

  // check bodyWeight is positive number or undefined
  if (typeof settings.bodyWeight === "number" && settings.bodyWeight < 0) {
    return {
      result: false,
      reason: "bodyWeight must be a positive number or null.",
    };
  }

  return {
    result: true,
    reason: "No user settings error detected.",
  };
}

export function verifyTemplates(templates: AddOrUpdateTemplateInput[]): {
  result: boolean;
  reason: string;
} {
  // 0 templates is okay.
  if (templates.length === 0) {
    return {
      result: true,
      reason: "No templates provided.",
    };
  }

  for (const template of templates) {
    // Title is required.
    if (!template.title.trim()) {
      return {
        result: false,
        reason: "Template name is required.",
      };
    }

    // weightUnit must be NULL when isBodyWeight=True
    if (template.isBodyWeight === true && template.weightUnit !== null) {
      return {
        result: false,
        reason: "Weight unit must be null for bodyweight templates.",
      };
    }

    // repsDisplay must be valid
    if (
      template.repsDisplay &&
      !validRepsDisplayed.includes(template.repsDisplay)
    ) {
      return {
        result: false,
        reason: `Exercise Reps Display must be one of ${validRepsDisplayed.join(
          ", "
        )}.`,
      };
    }
  }

  // unique titles
  if (
    new Set(templates.map((t) => t.title.trim().toLowerCase())).size !==
    templates.length
  ) {
    return {
      result: false,
      reason: "Each template must have a unique Title.",
    };
  }

  // indices numbered 0 - N without holes
  const indices = templates.map((template) => template.index);
  const sorted = indices.sort((a, b) => a - b);
  if (sorted[0] !== 0) {
    return {
      result: false,
      reason: "Template indices must start at 0.",
    };
  }
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i) {
      return {
        result: false,
        reason: `Invalid index sequence. Expected index ${i}, received ${sorted[i]}`,
      };
    }
  }

  return {
    result: true,
    reason: "No template error detected.",
  };
}
