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
// Function overload for MUTATING a past new workout.
export function formatExercisesForDB({ exercises, createdAt, workoutElapsedSeconds, }) {
    const formattedExercises = exercises.map((exercise) => {
        const { uid, title, weight, weightUnit, sets, reps, repsDisplay, comment, elapsedSeconds, } = exercise;
        const baseExercise = {
            title,
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
            elapsedSeconds,
            createdAt: createdAt !== null && workoutElapsedSeconds !== null
                ? formatCreatedAt(createdAt, workoutElapsedSeconds)
                : null,
        };
        // UID will only exist when updting an exercise.
        // Let the DB generate a UID for new exercises.
        return uid ? { uid, ...baseExercise } : baseExercise;
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
