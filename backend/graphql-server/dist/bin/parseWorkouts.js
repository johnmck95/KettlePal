/** To run this file:
 * tsc parseWorkouts.ts && mv parseWorkouts.js parseWorkouts.cjs && node parseWorkouts.cjs
 */
import * as fs from "fs";
const MonthMapping = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
};
function readAndLogFile(filePath) {
    let workouts;
    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        workouts = fileContent.split("\n\n");
    }
    catch (error) {
        console.error("Error reading file:", error);
    }
    for (let workout of workouts) {
        const lines = workouts[0].split("\n");
    }
}
function main() {
    const filePath = "./KETTLEBELL-HISTORY.TXT";
    readAndLogFile(filePath);
}
main();
