import dayjs from "dayjs";
export function verifyExercises(exercises) {
    if (exercises.length < 1) {
        return { result: false, reason: "At least 1 exercise is required." };
    }
    for (const exercise of exercises) {
        const { title, weight, sets, reps, repsDisplay, weightUnit, startTime, endTime, } = exercise;
        if (!title) {
            return {
                result: false,
                reason: `Exercise title is required. Received '${title}'.`,
            };
        }
        if (sets && !reps) {
            return {
                result: false,
                reason: `Exercise reps is required when sets is Provided. Received '${sets}' and '${reps}'.`,
            };
        }
        if (!sets && reps) {
            return {
                result: false,
                reason: `Exercise sets is required when reps is Provided. Received '${sets}' and '${reps}'.`,
            };
        }
        if ((sets || reps) && !repsDisplay) {
            return {
                result: false,
                reason: `Exercise repsDisplay is required when sets and reps are Provided. Received '${sets}', '${reps}', and '${repsDisplay}'.`,
            };
        }
        if (repsDisplay && (!sets || !reps)) {
            return {
                result: false,
                reason: `Exercise sets and reps are required when repsDisplay is Provided. Received '${sets}', '${reps}', and '${repsDisplay}'.`,
            };
        }
        if (weight && !weightUnit) {
            return {
                result: false,
                reason: `Exercise weightUnit is required when weight is Provided. Received '${weight}' and '${weightUnit}'.`,
            };
        }
        if (!weight && weightUnit) {
            return {
                result: false,
                reason: `Exercise weight is required when weightUnit is Provided. Received '${weight}' and '${weightUnit}'.`,
            };
        }
        if (startTime && endTime) {
            if (dayjs(startTime).isAfter(endTime)) {
                return {
                    result: false,
                    reason: `Exercise startTime must be before endTime. Received '${startTime}' and '${endTime}'.`,
                };
            }
        }
        if (startTime && !endTime) {
            return {
                result: false,
                reason: `Exercise endTime is required when startTime is Provided. Received '${startTime}' and '${endTime}'.`,
            };
        }
        if (!startTime && endTime) {
            return {
                result: false,
                reason: `Exercise startTime is required when endTime is Provided. Received '${startTime}' and '${endTime}'.`,
            };
        }
    }
    return { result: true, reason: "No exercises errors detected." };
}
