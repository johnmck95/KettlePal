import { validRepsDisplayed } from "./verifyExercises.js";
import { verifyTemplates } from "./verifySettings.js";

describe("verifyTemplates", () => {
  it("Let's template be an empty array", () => {
    const result = verifyTemplates([]);
    expect(result).toEqual({
      result: true,
      reason: "No templates provided.",
    });
  });

  it("Allows valid templates", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 1,
        isBodyWeight: false,
        title: "Press",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 2,
        isBodyWeight: true,
        title: "Pull Up",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: null,
      },
      {
        index: 3,
        isBodyWeight: false,
        title: "Armour Building Complex",
        multiplier: 6.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: true,
      reason: "No template error detected.",
    });
  });

  it("Rejects templates with a missing title", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Template name is required.",
    });
  });

  it("Rejects templates when title is repeated", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 1,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Each template must have a unique Title.",
    });
  });

  it("Rejects templates when title is repeated, case insensitive", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 1,
        isBodyWeight: false,
        title: "swing", // repeated
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Each template must have a unique Title.",
    });
  });

  it("Rejects templates when title is repeated, whitespace insensitive", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 1,
        isBodyWeight: false,
        title: " swing", // whitespace
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Each template must have a unique Title.",
    });
  });

  it("repsDisplay is valid when provided", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "STANDARD", // expected "std"
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: `Exercise Reps Display must be one of ${validRepsDisplayed.join(
        ", "
      )}.`,
    });
  });

  it("repsDisplay and weightUnit can be omitted for bodyWeight exercises", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: true,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: null,
        weightUnit: null,
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: true,
      reason: "No template error detected.",
    });
  });

  it("weightUnit must be null for bodyweight exercises", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: true,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Weight unit must be null for bodyweight templates.",
    });
  });

  it("Weight unit can be null or defined for non-bodyweight exercises.", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: null,
      },
      {
        index: 1,
        isBodyWeight: false,
        title: "Press",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg:",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: true,
      reason: "No template error detected.",
    });
  });

  it("Template indices must start from 0", () => {
    const templates = [
      {
        index: 1,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 2,
        isBodyWeight: false,
        title: "Press",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Template indices must start at 0.",
    });
  });

  it("Template indices are sequential starting from 0", () => {
    const templates = [
      {
        index: 0,
        isBodyWeight: false,
        title: "Swing",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
      {
        index: 2,
        isBodyWeight: false,
        title: "Press",
        multiplier: 1.0,
        repsDisplay: "std",
        weightUnit: "kg",
      },
    ];
    const results = verifyTemplates(templates);
    expect(results).toEqual({
      result: false,
      reason: "Invalid index sequence. Expected index 1, received 2",
    });
  });
});
