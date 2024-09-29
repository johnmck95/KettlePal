"use strict";
/** To run this file:
 * tsc parseWorkouts.ts && mv parseWorkouts.js parseWorkouts.cjs && node parseWorkouts.cjs
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var RUN_FOR_YEAR = "2024";
var MonthMapping = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    sept: "09",
    oct: "10",
    nov: "11",
    dec: "12",
};
var titleMapping = {
    "sa deadlift": "Single Leg Deadlift",
    "sa swing": "Single Arm Swing",
    tgu: "Turkish Get Up",
    "c&p": "Clean & Press",
    squat: "Goblet Squat",
};
function parseOpeningWorkoutLine(line) {
    var components = line.split(/[ :]+/);
    var date = RUN_FOR_YEAR +
        "-" +
        MonthMapping[components[0].toLowerCase()] +
        "-" +
        components[1].padStart(2, "0");
    var workoutComment = components.length > 2 ? components.slice(2).join(" ") : "";
    return { date: date, workoutComment: workoutComment };
}
function parseExerciseLeftOfColon(leftOfColon) {
    var _a, _b;
    var leftOfColonRegex = /^(.*?)\s*\((\d+)(kg|lb)\)$/;
    var match = leftOfColon.match(leftOfColonRegex);
    if (match) {
        return {
            title: titleMapping[(_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()] || ((_b = match[1]) === null || _b === void 0 ? void 0 : _b.trim()),
            weight: match[2],
            weightUnit: match[3],
        };
    }
    else {
        return { title: leftOfColon === null || leftOfColon === void 0 ? void 0 : leftOfColon.trim() };
    }
}
function parseExerciseRightOfColon(rightOfColon) {
    var _a;
    var parts = rightOfColon === null || rightOfColon === void 0 ? void 0 : rightOfColon.trim().split(" ");
    if (!!parts === false) {
        return {};
    }
    var setRepsPart = parts[0];
    // Handle cases where there's no 'x' in sets/reps part
    if (!setRepsPart.includes("x")) {
        return {
            comment: rightOfColon === null || rightOfColon === void 0 ? void 0 : rightOfColon.trim(),
        };
    }
    var _b = setRepsPart.split("x"), sets = _b[0], repsPart = _b[1];
    var repsDisplay;
    var reps;
    if (repsPart.includes("/")) {
        repsDisplay = "l/r";
        reps = parseInt(repsPart.split("/")[0]) * 2;
    }
    else if (repsPart.includes("(")) {
        var ladder = (_a = repsPart.match(/\(([\d,]+)\)/)) === null || _a === void 0 ? void 0 : _a[1];
        if (ladder) {
            repsDisplay = "(".concat(ladder, ")");
            var ladderNumbers = ladder.split(",").map(Number);
            reps = ladderNumbers.reduce(function (sum, num) { return sum + num; }, 0) * 2;
        }
    }
    else {
        repsDisplay = "std";
        reps = parseInt(repsPart);
    }
    var comment = parts.slice(1).join(" ") || undefined;
    return {
        sets: sets,
        repsDisplay: repsDisplay,
        reps: reps,
        comment: comment,
    };
}
function parseExerciseLine(line) {
    var components = line.split(/:/);
    var leftOfColon = components[0];
    var rightOfColon = components[1];
    var _a = parseExerciseLeftOfColon(leftOfColon), title = _a.title, weight = _a.weight, weightUnit = _a.weightUnit;
    var _b = parseExerciseRightOfColon(rightOfColon), sets = _b.sets, reps = _b.reps, repsDisplay = _b.repsDisplay, comment = _b.comment;
    var formattedExercise = {
        title: title !== null && title !== void 0 ? title : "",
        weight: weight !== null && weight !== void 0 ? weight : "",
        weightUnit: weightUnit !== null && weightUnit !== void 0 ? weightUnit : "",
        sets: sets !== null && sets !== void 0 ? sets : "",
        reps: (reps !== null && reps !== void 0 ? reps : "").toString(),
        repsDisplay: repsDisplay !== null && repsDisplay !== void 0 ? repsDisplay : "",
        comment: comment !== null && comment !== void 0 ? comment : "",
        elapsedSeconds: 0,
        key: "",
    };
    return formattedExercise;
}
function readAndParseWorkoutFile(filePath) {
    var workouts;
    try {
        var fileContent = fs.readFileSync(filePath, "utf-8");
        workouts = fileContent.split("\n\n");
    }
    catch (error) {
        console.error("Error reading file:", error);
    }
    var formattedWorkouts = [];
    // const easyWorkouts = [workouts[0]];
    // for (let workout of easyWorkouts) {
    for (var _i = 0, workouts_1 = workouts; _i < workouts_1.length; _i++) {
        var workout = workouts_1[_i];
        // Create new workout object
        var workoutWithExercises = {
            date: "",
            comment: "",
            elapsedSeconds: 0,
            exercises: [
                {
                    title: "",
                    weight: "",
                    weightUnit: "",
                    sets: "",
                    reps: "",
                    repsDisplay: "",
                    comment: "",
                    elapsedSeconds: 0,
                    key: "",
                },
            ],
        };
        var lines = workout.split("\n");
        // Format workout attributes and update object
        var _a = parseOpeningWorkoutLine(lines[0]), date = _a.date, workoutComment = _a.workoutComment;
        workoutWithExercises.date = date;
        workoutWithExercises.comment = workoutComment;
        workoutWithExercises.elapsedSeconds = 0;
        // Format exercises and update object
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i];
            var formattedExercise = parseExerciseLine(line);
            workoutWithExercises.exercises.push(formattedExercise);
        }
        formattedWorkouts.push(workoutWithExercises);
    }
    console.log(formattedWorkouts);
}
function main() {
    var filePath = "./".concat(RUN_FOR_YEAR, "-KETTLEBELL-HISTORY.TXT");
    readAndParseWorkoutFile(filePath);
}
main();
/**      EXAMPLE OBJECT OUTPUT WE WANT TO GENERATE
 {
    "userUid": "40f6e5fe-5ede-46a4-976e-8ff9d1da74cd",
    "workoutWithExercises": {
        "date": "2024-09-28",
        "comment": "workout comment",
        "elapsedSeconds": 1200,
        "exercises": [
            {
                "title": "Snatch",
                "weight": "28",
                "weightUnit": "kg",
                "sets": "12",
                "reps": "12",
                "repsDisplay": "l/r",
                "comment": "",
                "elapsedSeconds": 1200,
                "key": "key-1727569146001-0.4oiuhyj4ush"
            }
        ]
    }
}
 */
