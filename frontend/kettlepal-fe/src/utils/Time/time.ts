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
