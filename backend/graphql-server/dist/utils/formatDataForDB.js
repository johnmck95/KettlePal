// Function overload for MUTATING a past new workout.
export function formatExercisesForDB(exercises) {
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
        };
        // UID will only exist when updting an exercise.
        // Let the DB generate a UID for new exercises.
        return uid ? { uid, ...baseExercise } : baseExercise;
    });
    return formattedExercises;
}
export function formatWorkoutForDB(workoutWithExercises, userUid) {
    const { date, elapsedSeconds, comment } = workoutWithExercises;
    const formattedWorkout = {
        userUid,
        date,
        elapsedSeconds,
        comment,
    };
    return formattedWorkout;
}
