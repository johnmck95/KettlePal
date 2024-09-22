import dayjs from "dayjs";
// Frontend collects YYYY-MM-DD.
// This adds the current HH:MM:SS:SSSZ less the elapsed seconds.
function formatCreatedAt(createdAt, elapsedSeconds) {
    const currentTime = dayjs().format("HH:mm:ss.SSSZ");
    const fullCreatedAt = dayjs(`${createdAt}T${currentTime}`)
        .subtract(elapsedSeconds, "seconds")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    return fullCreatedAt;
}
export function formatExercisesForDB({ exercises, createdAt, workoutElapsedSeconds, }) {
    const formattedExercises = exercises.map((exercise) => {
        const { title, weight, weightUnit, sets, reps, repsDisplay, comment, elapsedSeconds, } = exercise;
        return {
            title,
            weight: isNaN(parseFloat(weight))
                ? null
                : parseFloat(weight),
            weightUnit: weightUnit !== "" ? weightUnit : null,
            // Frontend collects strings, but we store these values as floats in the DB.
            sets: isNaN(parseFloat(sets))
                ? null
                : parseFloat(sets),
            reps: isNaN(parseFloat(reps))
                ? null
                : parseFloat(reps),
            repsDisplay: repsDisplay !== "" ? repsDisplay : null,
            comment: comment !== "" ? comment : null,
            elapsedSeconds,
            createdAt: createdAt !== null && workoutElapsedSeconds !== null
                ? formatCreatedAt(createdAt, workoutElapsedSeconds)
                : null,
        };
    });
    return formattedExercises;
}
export function formatWorkoutForDB(workoutWithExercises, userUid) {
    const { createdAt, elapsedSeconds, comment } = workoutWithExercises;
    const formattedWorkout = {
        userUid: userUid,
        createdAt: formatCreatedAt(createdAt, elapsedSeconds),
        elapsedSeconds,
        comment,
    };
    return formattedWorkout;
}
