import dayjs from "dayjs";

/**
 * Converts a postgres timestamp to a dayJs object considering unix timestamp conventions.
 * @param timestamp the unedited postgres timestamp.
 * @returns a dayJs object that correctly handles unix conversions
 */
export function postgresToDayJs(timestamp: string): dayjs.Dayjs {
  return dayjs.unix(Number(timestamp) / 1000);
}
