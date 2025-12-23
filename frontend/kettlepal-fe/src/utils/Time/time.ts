import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

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

const pad = (num: number): string => num.toString().padStart(2, "0");
const pluralize = (word: string, count: number): string =>
  `${word}${count !== 1 ? "s" : ""}`;

// Converts seconds into "HHH:MM:SS" format when verbose is false
// Converts seconds into  "X hrs, Y mins, Z secs" when verbose is true
export const formatTime = (
  seconds: number,
  verbose: boolean = false
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (verbose) {
    return [
      hours > 0 ? `${hours} ${pluralize("hr", hours)}` : "",
      minutes > 0 ? `${minutes} ${pluralize("min", minutes)}` : "",
      secs > 0 ? `${secs} ${pluralize("sec", secs)}` : "",
    ]
      .filter(Boolean)
      .join(", ");
  }

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    : `${pad(minutes)}:${pad(secs)}`;
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

//EX: September 13, 2024
export function epochToLongDateString(epoch: string) {
  return new Date(Number(epoch)).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// EX: Sept 13th, 2024
export function formatDate(date: Date, showYear: boolean = true): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const suffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (showYear) {
    return `${month} ${day}${suffix(day)}, ${year}`;
  } else {
    return `${month} ${day}${suffix(day)}`;
  }
}

/**
 * Returns a string in the format "YYYY-MM-DD,YYYY-MM-DD" representing
 * the start and end dates of the current Week, Month, or Year.
 */
type Period = "Week" | "Month" | "Year";
export function getCurrentPeriodYYYYMMDD(period: Period): string {
  const today = dayjs();
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  switch (period) {
    case "Week":
      start = today.startOf("isoWeek");
      end = today.endOf("isoWeek");
      break;
    case "Month":
      start = today.startOf("month");
      end = today.endOf("month");
      break;
    case "Year":
      start = today.startOf("year");
      end = today.endOf("year");
      break;
    default:
      throw new Error(`Unsupported period: ${period}`);
  }

  return `${start.format("YYYY-MM-DD")},${end.format("YYYY-MM-DD")}`;
}

/**
 * @param min The number of days ahead or behind today
 * @param max The number of days ahead or behind today
 * @returns A string in the format "YYYY-MM-DD,YYYY-MM-DD" representing the "MIN,MAX" date range.
 */
export function createDateRangeString(min: number, max: number) {
  const centerDate = dayjs().isoWeekday(4);
  const minDate = centerDate.add(min, "day");
  const maxDate = centerDate.add(max, "day");
  const formattedMinDate = minDate.format("YYYY-MM-DD");
  const formattedMaxDate = maxDate.format("YYYY-MM-DD");
  return `${formattedMinDate},${formattedMaxDate}`;
}

export function formatSelectedDateRange(
  rangeStart: string | undefined,
  rangeEnd: string | undefined,
  showYear: boolean = false
) {
  if (!rangeStart || !rangeEnd) {
    return "";
  }

  const startDate = new Date(rangeStart + "T12:00:00");
  const endDate = new Date(rangeEnd + "T12:00:00");
  // EX: Dec 31st, 2025 - Jan 6th, 2026
  if (startDate.getFullYear() !== endDate.getFullYear()) {
    return `${formatDate(
      startDate,
      showYear
    )}, ${endDate.getFullYear()} - ${formatDate(
      endDate,
      showYear
    )}, ${endDate.getFullYear()}`;
  }
  // EX: Jan 5th, 2026
  if (rangeStart === rangeEnd) {
    return `${formatDate(startDate, showYear)}, ${endDate.getFullYear()}`;
  } // EX: Jan 5th - 12th, 2026
  else {
    return `${formatDate(startDate, showYear)} - ${formatDate(
      endDate,
      showYear
    )}, ${endDate.getFullYear()}`;
  }
}

//EX: 5h 07m
export const formatHrsMins = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return hours > 0 ? `${pad(hours)}h ${pad(minutes)}` : `${pad(minutes)}m`;
};
