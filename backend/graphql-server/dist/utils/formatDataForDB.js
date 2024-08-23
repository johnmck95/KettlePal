import dayjs from "dayjs";
export function formatExercisesForDB(workoutWithExercises) {
    const { exercises } = workoutWithExercises;
    const formattedExercises = exercises.map((exercise) => {
        const { title, weight, weightUnit, sets, reps, repsDisplay, comment, startTime, endTime, } = exercise;
        return {
            title,
            weight,
            weightUnit,
            // Frontend collects strings, but we store these values as floats in the DB.
            sets: parseFloat(sets),
            reps: parseFloat(reps),
            repsDisplay,
            comment,
            startTime: startTime
                ? dayjs(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                : null,
            endTime: endTime
                ? dayjs(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                : null,
        };
    });
    return formattedExercises;
}
export function formatWorkoutForDB(workoutWithExercises, userUid) {
    const { createdAt, startTime, endTime, comment } = workoutWithExercises;
    const currentTime = dayjs().format("HH:mm:ss.SSSZ");
    // Appends Hr/Min/Sec... since created add is a calendar date, only.
    const fullCreatedAt = dayjs(`${createdAt}T${currentTime}`).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedWorkout = {
        userUid: userUid,
        createdAt: fullCreatedAt,
        startTime: startTime
            ? dayjs(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : null,
        endTime: endTime ? dayjs(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ") : null,
        comment,
    };
    return formattedWorkout;
}
