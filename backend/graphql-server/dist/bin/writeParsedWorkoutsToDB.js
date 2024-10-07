/** TO RUN THIS SCRIPT:
 * npm run build && npm run parseWorkouts
 *
 * ...or manually..
 * tsc writeParsedWorkoutsToDB.ts && mv writeParsedWorkoutsToDB.js writeParsedWorkoutsToDB.cjs && node writeParsedWorkoutsToDB.cjs
 */
import * as fs from "fs";
import { resolvers } from "../resolvers.js";
import { fileURLToPath } from "url";
import path, { join } from "path";
const MY_USER_UID = "2651f1a4-abd3-482e-b1c3-4c412a0dd2a6"; // local & prod
// const RUN_FOR_YEAR = "2024"; // Successfully uploaded to prod
// const RUN_FOR_YEAR = "2023"; // Successfully uploaded to prod
const RUN_FOR_YEAR = "2022";
const addWorkoutWithExercises = resolvers.Mutation.addWorkoutWithExercises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mockContext = {
    req: {
        userUid: MY_USER_UID,
    },
};
const filePath = join(__dirname, "..", "..", "data", `${RUN_FOR_YEAR}-parsedOutput.json`);
const fileContent = fs.readFileSync(filePath, "utf-8");
const jsonData = JSON.parse(fileContent);
async function processWorkout(workout) {
    try {
        const result = await addWorkoutWithExercises(null, {
            userUid: mockContext.req.userUid,
            workoutWithExercises: workout,
        }, mockContext);
        console.log(`Successfully added workout: ${result.uid}`);
    }
    catch (error) {
        console.error(`Failed to add workout: ${error.message}`);
        console.log(workout);
    }
}
async function processAllWorkouts() {
    console.log(`Processing ${jsonData.length} workouts...`);
    for (const workout of jsonData) {
        // console.log("-------------------");
        // console.log(workout);
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
