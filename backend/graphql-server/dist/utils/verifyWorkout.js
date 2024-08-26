export function verifyWorkout(workout) {
    if (!workout.createdAt)
        return { result: false, reason: "createdAt is required" };
    return { result: true, reason: "No workout error detected." };
}
