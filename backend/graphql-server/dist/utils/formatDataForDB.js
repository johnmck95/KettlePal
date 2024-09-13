import dayjs from "dayjs";
export function formatExercisesForDB(workoutWithExercises) {
    const { exercises } = workoutWithExercises;
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
        };
    });
    return formattedExercises;
}
export function formatWorkoutForDB(workoutWithExercises, userUid) {
    const { createdAt, elapsedSeconds, comment } = workoutWithExercises;
    const currentTime = dayjs().format("HH:mm:ss.SSSZ");
    // Appends Hr/Min/Sec... since created add is a calendar date, only.
    const fullCreatedAt = dayjs(`${createdAt}T${currentTime}`)
        .subtract(elapsedSeconds, "seconds")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedWorkout = {
        userUid: userUid,
        createdAt: fullCreatedAt,
        elapsedSeconds,
        comment,
    };
    return formattedWorkout;
}
