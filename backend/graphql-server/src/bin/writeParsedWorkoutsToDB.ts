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
import { resolvers } from "../resolvers.js";
import { fileURLToPath } from "url";
import path, { join } from "path";

// const RUN_FOR_YEAR = "2024"; Successfully run for prod
// const RUN_FOR_YEAR = "2023"; Successfully run for prod
// const RUN_FOR_YEAR = "2022"; Successfully run for prod
const RUN_FOR_YEAR = "0"; // Completed running this script.
const MY_USER_UID = "2651f1a4-abd3-482e-b1c3-4c412a0dd2a6"; // local & prod

const addWorkoutWithExercises = resolvers.Mutation.addWorkoutWithExercises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockContext = {
  req: {
    userUid: MY_USER_UID,
  },
};

const filePath = join(
  __dirname,
  "..",
  "..",
  "data",
  `${RUN_FOR_YEAR}-parsedOutput.json`
);

const fileContent = fs.readFileSync(filePath, "utf-8");
const jsonData = JSON.parse(fileContent);

async function processWorkout(workout: any) {
  try {
    const result = await addWorkoutWithExercises(
      null,
      {
        userUid: mockContext.req.userUid,
        workoutWithExercises: workout,
      },
      mockContext
    );
    console.log(`Successfully added workout: ${result.uid}`);
  } catch (error) {
    console.error(`Failed to add workout: ${error.message}`);
    console.log(workout);
  }
}

async function processAllWorkouts() {
  console.log(`Processing ${jsonData.length} workouts...`);

  for (const workout of jsonData) {
    await processWorkout(workout);
  }
}

processAllWorkouts()
  .then(() => {
    console.log("Finished processing all workouts");
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
