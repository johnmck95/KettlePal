import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Postgres timestamps are in UTC
dayjs.extend(utc);
dayjs.extend(timezone);

// Returns YYYY-MM-DD format of the current date
export function getCurrentDate(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDurationLong(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let result = "";

  if (hrs > 0) {
    result += `${hrs} hour${hrs > 1 ? "s" : ""} `;
  }

  if (mins > 0 || hrs > 0) {
    result += `${mins} minute${mins > 1 ? "s" : ""} `;
  }

  if (secs > 0) {
    result += `${secs} second${secs > 1 ? "s" : ""}`;
  }

  return result;
}

export function formatDurationShort(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : "";
  const formattedMinutes = mins.toString().padStart(2, "0");
  const formattedSeconds = secs.toString().padStart(2, "0");

  let result = formattedHours + `${formattedMinutes}:${formattedSeconds}`;

  return result;
}

// Converts seconds (number) into HHH:MM:SS format
export const formatTime = (seconds: number, verbose: boolean = false) => {
  const getSeconds = `0${seconds % 60}`.slice(-2);
  const minutes = Math.floor(seconds / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  let getHours = `${Math.floor(seconds / 3600)}`;
  if (getHours.length < 2) {
    getHours = "0" + getHours;
  }

  if (verbose) {
    return `${Number(getHours) > 0 ? `${getHours} hr, ` : ""}  ${
      Number(getMinutes) === 0 ? 0 : getMinutes
    } mins, ${Number(getSeconds) === 0 ? 0 : getSeconds} secs`;
  }

  if (getHours === "00") {
    return `${getMinutes}:${getSeconds}`;
  } else {
    return `${getHours}:${getMinutes}:${getSeconds}`;
  }
};

// Turns user input (string) into HHH:MM:SS format
// Strips all non-numeric characters, adds colons, then pads with 0's
export function formatTimeInput(value: string): string {
  let numericValue = value.replace(/[^0-9]/g, "");
  let formatted = "";
  let counted = 0;

  // right to left, add colons back in
  for (let i = numericValue.length - 1; i >= 0; i--) {
    counted++;
    // 2 colons means we already have the :MM:SS, append the HHH..
    if (formatted.split(":").length - 1 >= 2) {
      formatted = numericValue.slice(0, i + 1) + formatted;
      break;
    }
    // Add a colon after the first 2 digits
    if (counted === 2 && i !== 0) {
      formatted = ":" + numericValue[i] + formatted;
      counted = 0;
      // Add the first (right) digit of :MM or :SS
    } else {
      formatted = numericValue[i] + formatted;
    }
  }

  // Pad with 0's
  const len = formatted.length;
  if (len === 0) {
    return "00:00";
  } else if (len === 1) {
    return "00:0" + formatted;
  } else if (len === 2 || len === 3) {
    return "00:" + formatted;
  } else if (len === 4 || len === 7) {
    return "0" + formatted;
  } else if (len === 6) {
    return "00" + formatted;
  }

  return formatted;
}

// Converts HHH:MM:SS format to seconds
export function computeSeconds(formattedSeconds: string) {
  const timeSegments = formattedSeconds.split(":");

  let totalSeconds = 0;
  if (timeSegments.length === 3) {
    const hours = parseInt(timeSegments[0]);
    const minutes = parseInt(timeSegments[1]);
    const seconds = parseInt(timeSegments[2]);
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
  } else {
    const minutes = parseInt(timeSegments[0]);
    const seconds = parseInt(timeSegments[1]);
    totalSeconds = minutes * 60 + seconds;
  }
  return totalSeconds;
}

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

export function calculateElapsedTime(startTimeStamp: number) {
  const currentTimeStamp = new Date().getTime();
  return Math.floor((currentTimeStamp - startTimeStamp) / 1000);
}

//EX: September 13, 2024
export function epochToLongDateString(epoch: string) {
  return new Date(Number(epoch)).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

//EX: 19% of days were active between 2022-11-01 and now
export function calculateTotalActiveDaysPercentage(
  totalWorkouts: number | undefined | null,
  oldestWorkoutDate: string | undefined,
  precision: number = 2
): string {
  const workouts = totalWorkouts ?? 0;
  const startDate = oldestWorkoutDate
    ? new Date(oldestWorkoutDate)
    : new Date();

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const totalDays = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 1);

  const percentage = Math.min((workouts / totalDays) * 100, 100);

  return percentage.toFixed(precision) + "%";
}
