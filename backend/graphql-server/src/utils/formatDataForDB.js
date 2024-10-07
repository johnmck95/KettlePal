"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatExercisesForDB = formatExercisesForDB;
exports.formatWorkoutForDB = formatWorkoutForDB;
// Function overload for MUTATING a past new workout.
function formatExercisesForDB(exercises) {
    var formattedExercises = exercises.map(function (exercise) {
        var uid = exercise.uid, title = exercise.title, weight = exercise.weight, weightUnit = exercise.weightUnit, sets = exercise.sets, reps = exercise.reps, repsDisplay = exercise.repsDisplay, comment = exercise.comment, elapsedSeconds = exercise.elapsedSeconds;
        var baseExercise = {
            title: title,
            weight: isNaN(parseFloat(weight))
                ? null
                : parseFloat(weight),
            weightUnit: weightUnit !== "" ? weightUnit : null,
            sets: isNaN(parseFloat(sets))
                ? null
                : parseFloat(sets),
            reps: isNaN(parseFloat(reps))
                ? null
                : parseFloat(reps),
            repsDisplay: repsDisplay !== "" ? repsDisplay : null,
            comment: comment !== "" ? comment : null,
            elapsedSeconds: elapsedSeconds,
        };
        // UID will only exist when updting an exercise.
        // Let the DB generate a UID for new exercises.
        return uid ? __assign({ uid: uid }, baseExercise) : baseExercise;
    });
    return formattedExercises;
}
function formatWorkoutForDB(workoutWithExercises, userUid) {
    var date = workoutWithExercises.date, elapsedSeconds = workoutWithExercises.elapsedSeconds, comment = workoutWithExercises.comment;
    var formattedWorkout = {
        userUid: userUid,
        date: date,
        elapsedSeconds: elapsedSeconds,
        comment: comment,
    };
    return formattedWorkout;
}
