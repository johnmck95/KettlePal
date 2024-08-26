export function verifyWorkout(workout) {
    const { createdAt, elapsedSeconds } = workout;
    if (!createdAt)
        return { result: false, reason: "createdAt is required" };
    if (elapsedSeconds < 0 || typeof elapsedSeconds !== "number") {
        return {
            result: false,
            reason: `Workout Elapsed Seconds must be a numerical value greater than or equal to 0.`,
        };
    }
    return { result: true, reason: "No workout error detected." };
}
