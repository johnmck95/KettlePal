import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Postgres timestamps are in UTC
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts a postgres timestamp to a dayJs object considering unix timestamp conventions.
 * Tries to convert to the users locale timezone.
 * @param timestamp the unedited postgres timestamp.
 * @returns a dayJs object that correctly handles unix conversions
 */

export function postgresToDayJs(timestamp: string): dayjs.Dayjs {
  const utcTime = dayjs.utc(dayjs.unix(Number(timestamp) / 1000));
  const localTime = utcTime.tz(dayjs.tz.guess() ?? "America/Vancouver");
  return localTime;
}

export function formatDateForYYYYMMDD(date: dayjs.Dayjs): string {
  return dayjs(date).format("YYYY-MM-DD");
}

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
export const formatTime = (seconds: number) => {
  const getSeconds = `0${seconds % 60}`.slice(-2);
  const minutes = Math.floor(seconds / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  let getHours = `${Math.floor(seconds / 3600)}`;
  if (getHours.length < 2) {
    getHours = "0" + getHours;
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
