import dayjs from "dayjs";
export function formatExercisesForDB(workoutWithExercises) {
    const { exercises } = workoutWithExercises;
    const formattedExercises = exercises.map((exercise) => {
        const { title, weight, weightUnit, sets, reps, repsDisplay, comment, startTime, endTime, } = exercise;
        return {
            title,
            weight,
            weightUnit,
            sets,
            reps,
            repsDisplay,
            comment,
            startTime: dayjs(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            endTime: dayjs(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        };
    });
    return formattedExercises;
}
export function formatWorkoutForDB(workoutWithExercises, userUid) {
    const { createdAt, startTime, endTime, comment } = workoutWithExercises;
    const formattedWorkout = {
        userUid: userUid,
        createdAt: dayjs(createdAt).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        startTime: dayjs(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        endTime: dayjs(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        comment,
    };
    return formattedWorkout;
}
