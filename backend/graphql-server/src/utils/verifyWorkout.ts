import { FormattedWorkout } from "./formatDataForDB";

// Validates YYYY-MM-DD format
export function isValidDateFormat(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check the ranges of year and month
  if (year < 1900 || year > 3000 || month <= 0 || month > 12) {
    return false;
  }

  // Adjust for leap years
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

export function verifyWorkout(workout: FormattedWorkout): {
  result: boolean;
  reason: string;
} {
  const { date, elapsedSeconds } = workout;

  if (!date) {
    return { result: false, reason: "date is required" };
  }

  if (!isValidDateFormat(date)) {
    return {
      result: false,
      reason: `Date must be in the format YYYY-MM-DD.`,
    };
  }

  if (
    elapsedSeconds == null ||
    elapsedSeconds < 0 ||
    typeof elapsedSeconds !== "number"
  ) {
    return {
      result: false,
      reason: `Workout Elapsed Seconds must be a numerical value greater than or equal to 0.`,
    };
  }

  return { result: true, reason: "No workout error detected." };
}
