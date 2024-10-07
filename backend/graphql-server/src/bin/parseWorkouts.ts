/** SCRIPT INSTRUCTIONS **
 *
 * --> parseWorkouts.ts will try to parse XXXX-KETTLEBELLHISTORY.txt and turn it into JSON.
 * --> writeParsedWorkoutsToDB.ts will try to read this parsed JSON, run it through the GraphQL server and write it to the database.
 *
 * To only generate the JSON:
 *      npm run build && npm run parseWorkouts
 *
 * To generate the JSON and write it to the database:
 *      npm run build && npm parseAndUploadWorkouts
 */

import * as fs from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";

// const RUN_FOR_YEAR = "2024"; Successfully run for prod
// const RUN_FOR_YEAR = "2023"; Successfully run for prod
// const RUN_FOR_YEAR = "2022"; Successfully run for prod
const RUN_FOR_YEAR = "0"; // Completed running this script.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AddExerciseInput {
  title: string;
  weight?: string;
  weightUnit?: string;
  sets?: string;
  reps?: string;
  repsDisplay?: string;
  comment?: string;
  elapsedSeconds?: number;
}

interface AddWorkoutWithExercisesInput {
  date: string;
  elapsedSeconds?: number;
  comment?: string;
  exercises: AddExerciseInput[];
}

const MonthMapping = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  sep: "09",
  sept: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

const titleMapping = {
  "sa deadlift": "Single Leg Deadlift",
  "sa swing": "Single Arm Swing",
  "s/a swing": "Single Arm Swing",
  tgu: "Turkish Get Up",
  "c&p": "Clean & Press",
  squat: "Goblet Squat",
  bench: "Bench Press",
};

function parseOpeningWorkoutLine(line: string) {
  const components = line.split(/[ :]+/);
  const date =
    RUN_FOR_YEAR +
    "-" +
    MonthMapping[components[0]?.toLowerCase()] +
    "-" +
    components[1]?.toLowerCase().padStart(2, "0");
  const workoutComment =
    components.length > 2 ? components.slice(2).join(" ") : "";

  return { date, workoutComment };
}

function parseExerciseLeftOfColon(leftOfColon: string) {
  const leftOfColonRegex = /^(.*?)\s*\((\d+)(kg|lb)\)$/;
  const match = leftOfColon.match(leftOfColonRegex);

  if (match) {
    return {
      title: titleMapping[match[1]?.trim().toLowerCase()] || match[1]?.trim(),
      weight: match[2],
      weightUnit: match[3],
    };
  } else {
    return { title: leftOfColon?.trim() };
  }
}

function parseExerciseRightOfColon(rightOfColon: string) {
  const parts = rightOfColon?.trim().split(" ");
  if (!!parts === false) {
    return {};
  }
  let setRepsPart = parts[0];

  // Handle cases where there's no 'x' in sets/reps part
  if (!setRepsPart.includes("x")) {
    return {
      comment: rightOfColon?.trim(),
    };
  }

  const [sets, repsPart] = setRepsPart.split("x");

  let repsDisplay: string | undefined;
  let reps: number | undefined;

  if (repsPart.includes("/")) {
    repsDisplay = "l/r";
    reps = parseInt(repsPart.split("/")[0]) * 2;
  } else if (repsPart.includes("(")) {
    const ladder = repsPart.match(/\(([\d,]+)\)/)?.[1];
    if (ladder) {
      repsDisplay = `(${ladder})`;
      const ladderNumbers = ladder.split(",").map(Number);
      reps = ladderNumbers.reduce((sum, num) => sum + num, 0) * 2;
    }
  } else {
    repsDisplay = "std";
    reps = parseInt(repsPart);
  }

  const comment = parts.slice(1).join(" ") || undefined;

  return {
    sets,
    repsDisplay,
    reps,
    comment,
  };
}

function parseExerciseLine(line: string) {
  const components = line.split(/:/);
  const leftOfColon = components[0];
  const rightOfColon = components[1];

  const { title, weight, weightUnit } = parseExerciseLeftOfColon(leftOfColon);
  const { sets, reps, repsDisplay, comment } =
    parseExerciseRightOfColon(rightOfColon);

  let formattedExercise = {
    title: title ?? "",
    weight: weight ?? "",
    weightUnit: weightUnit ?? "",
    sets: sets ?? "",
    reps: (reps ?? "").toString(),
    repsDisplay: repsDisplay ?? "",
    comment: comment ?? "",
    elapsedSeconds: 0,
    key: "",
  };
  return formattedExercise;
}

function readAndParseWorkoutFile(filePath: string): void {
  let workouts;
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    workouts = fileContent.split("\n\n");
  } catch (error) {
    console.error("Error reading file:", error);
  }

  // Final output of this script
  const formattedWorkouts: AddWorkoutWithExercisesInput[] = [];

  for (let workout of workouts) {
    // Create new workout object
    let workoutWithExercises = {
      date: "",
      comment: "",
      elapsedSeconds: 0,
      exercises: [],
    };
    const lines = workout.split("\n");

    // Format workout attributes and update object
    const { date, workoutComment } = parseOpeningWorkoutLine(lines[0]);
    workoutWithExercises.date = date;
    workoutWithExercises.comment = workoutComment;
    workoutWithExercises.elapsedSeconds = 0;

    // Format exercises and update object
    for (let i = 1; i < lines.length; i++) {
      // line is correct
      const line = lines[i];
      const formattedExercise = parseExerciseLine(line);
      workoutWithExercises.exercises.push(formattedExercise);
    }

    formattedWorkouts.push(workoutWithExercises);
  }

  writeOutputToFile(JSON.stringify(formattedWorkouts, null, 2));
}

function writeOutputToFile(output: string) {
  const filePath = join(
    __dirname,
    "..",
    "..",
    "data",
    `${RUN_FOR_YEAR}-parsedOutput.json`
  );
  fs.writeFileSync(filePath, output);
}

function main() {
  const filePath = join(
    __dirname,
    "..",
    "..",
    "data",
    `${RUN_FOR_YEAR}-KETTLEBELL-HISTORY.TXT`
  );

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
