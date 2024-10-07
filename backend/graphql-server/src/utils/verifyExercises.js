"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyExercises = verifyExercises;
function verifyExercises(_a) {
    var exercises = _a.exercises, _b = _a.updatingWorkout, updatingWorkout = _b === void 0 ? false : _b;
    // You can delete the last exercise when updating,
    // but you cannot create a new workout with no exercises
    if (updatingWorkout === false && exercises.length < 1) {
        return { result: false, reason: "At least 1 exercise is required." };
    }
    for (var _i = 0, exercises_1 = exercises; _i < exercises_1.length; _i++) {
        var exercise = exercises_1[_i];
        var title = exercise.title, weight = exercise.weight, setsString = exercise.sets, repsString = exercise.reps, repsDisplay = exercise.repsDisplay, weightUnit = exercise.weightUnit, elapsedSeconds = exercise.elapsedSeconds;
        // Frontend collects strings, but we store these values as floats in the DB.
        var reps = parseFloat(repsString);
        var sets = parseFloat(setsString);
        if (!title) {
            return {
                result: false,
                reason: "Exercise title is required. Received '".concat(title, "'."),
            };
        }
        if (!reps && (sets || repsDisplay)) {
            return {
                result: false,
                reason: "Exercise Reps is required when Sets or Reps Display is provided.",
            };
        }
        if (!sets && (reps || repsDisplay)) {
            return {
                result: false,
                reason: "Exercise Sets is required when Reps or Reps Display is provided",
            };
        }
        if (!repsDisplay && (sets || reps)) {
            return {
                result: false,
                reason: "Exercise Reps Display is required when Sets or Reps are provided.",
            };
        }
        if (weight && !weightUnit) {
            return {
                result: false,
                reason: "Exercise Weight Unit is required when Weight is provided",
            };
        }
        if (!weight && weightUnit) {
            return {
                result: false,
                reason: "Exercise Weight is required when Weight Unit is provided.",
            };
        }
        if (elapsedSeconds < 0 || typeof elapsedSeconds !== "number") {
            return {
                result: false,
                reason: "Exercise Elapsed Seconds must be a numerical value greater than or equal to 0.",
            };
        }
        var validRepsDisplayed = [
            null,
            "",
            "l/r",
            "std",
            "(1,2)",
            "(1,2,3)",
            "(1,2,3,4)",
            "(1,2,3,4,5)",
        ];
        if (!validRepsDisplayed.includes(repsDisplay)) {
            return {
                result: false,
                reason: "Exercise Reps Display must be one of ".concat(validRepsDisplayed.join(", "), "."),
            };
        }
        if (repsDisplay === "l/r" && reps % 2 !== 0) {
            return {
                result: false,
                reason: "Exercise Reps must be even when Reps Display is 'l/r'.",
            };
        }
        if (repsDisplay === "(1,2)" && reps !== 6) {
            return {
                result: false,
                reason: "Exercise Reps must be 6 when Reps Display is '(1,2)'.",
            };
        }
        if (repsDisplay === "(1,2,3)" && reps !== 12) {
            return {
                result: false,
                reason: "Exercise Reps must be 12 when Reps Display is '(1,2,3)'.",
            };
        }
        if (repsDisplay === "(1,2,3,4)" && reps !== 20) {
            return {
                result: false,
                reason: "Exercise Reps must be 20 when Reps Display is '(1,2,3,4)'.",
            };
        }
        if (repsDisplay === "(1,2,3,4,5)" && reps !== 30) {
            return {
                result: false,
                reason: "Exercise Reps must be 30 when Reps Display is '(1,2,3,4,5)'.",
            };
        }
    }
    return { result: true, reason: "No exercises errors detected." };
}
