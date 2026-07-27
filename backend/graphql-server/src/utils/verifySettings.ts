import { AddOrUpdateSettingsInput } from "../generated/backend-types.js";

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
