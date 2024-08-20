import dayjs from "dayjs";
export function verifyWorkout(workout) {
    if (!workout.createdAt)
        return { result: false, reason: "createdAt is required" };
    const { startTime, endTime } = workout;
    if (startTime && endTime) {
        if (dayjs(startTime).isAfter(endTime)) {
            return {
                result: false,
                reason: `Workout Start Time must be before End Time.`,
            };
        }
    }
    if (startTime && !endTime) {
        return {
            result: false,
            reason: `Workout End Time is required when Start Time is provided.`,
        };
    }
    if (!startTime && endTime) {
        return {
            result: false,
            reason: `Workout Start Time is required when End Time is provided.`,
        };
    }
    return { result: true, reason: "No workout error detected." };
}
