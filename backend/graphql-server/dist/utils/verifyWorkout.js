import dayjs from "dayjs";
export function verifyWorkout(workout) {
    if (!workout.createdAt)
        return { result: false, reason: "createdAt is required" };
    const { startTime, endTime } = workout;
    if (startTime && endTime) {
        if (dayjs(startTime).isAfter(endTime)) {
            return {
                result: false,
                reason: `Workout startTime must be before endTime. Received '${startTime}' and '${endTime}'.`,
            };
        }
    }
    if (startTime && !endTime) {
        return {
            result: false,
            reason: `Workout endTime is required when startTime is Provided. Received '${startTime}' and '${endTime}'.`,
        };
    }
    if (!startTime && endTime) {
        return {
            result: false,
            reason: `Workout startTime is required when endTime is Provided. Received '${startTime}' and '${endTime}'.`,
        };
    }
    return { result: true, reason: "No workout error detected." };
}
