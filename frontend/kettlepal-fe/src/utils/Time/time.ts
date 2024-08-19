import dayjs from "dayjs";

/**
 * Converts a postgres timestamp to a dayJs object considering unix timestamp conventions.
 * @param timestamp the unedited postgres timestamp.
 * @returns a dayJs object that correctly handles unix conversions
 */
export function postgresToDayJs(timestamp: string): dayjs.Dayjs {
  return dayjs.unix(Number(timestamp) / 1000);
}

export function getCurrentDate(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
