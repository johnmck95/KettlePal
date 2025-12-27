import { DateRangeInput } from "../generated/backend-types";

// Validates dateStr is YYYY-MM-DD and a real date.
export const validateDateFormat = (dateStr: string, fieldName: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(
      `${fieldName} must be in YYYY-MM-DD format. Received: ${dateStr}`
    );
  }
  // Also validate it's a real date (catches 2025-02-30, etc.)
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(
      `${fieldName} must be a valid date in YYYY-MM-DD format. Received: ${dateStr}`
    );
  }
};

// Validates that range.start is before or equal to range.end
export const validateRangeEndAfterStart = (range: DateRangeInput) => {
  if (new Date(range.start) > new Date(range.end)) {
    throw new Error("Invalid date range: start date cannot be after end date.");
  }
};

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Validates range.start is a Monday
export const validateRangeStartIsMonday = (dateStr: string) => {
  validateDateFormat(dateStr, "Range.start");
  const startDate = new Date(dateStr + "T12:00:00Z");
  if (startDate.getDay() !== 1) {
    throw new Error(
      `Range.start must be a Monday. Received ${dateStr} (${
        dayNames[startDate.getDay()]
      })`
    );
  }
};

// Validates range.end is a Sunday
export const validateRangeEndIsSunday = (dateStr: string) => {
  validateDateFormat(dateStr, "Range.end");
  const endDate = new Date(dateStr + "T12:00:00Z");
  if (endDate.getDay() !== 0) {
    throw new Error(
      `Range.end must be a Sunday. Received ${dateStr} (${
        dayNames[endDate.getDay()]
      })`
    );
  }
};

// Validates range.start is the 1st of the month
export const validateRangeStartIsFirstOfMonth = (dateStr: string) => {
  validateDateFormat(dateStr, "Range.start");
  const startDay = parseInt(dateStr.split("-")[2], 10);
  if (startDay !== 1) {
    throw new Error(
      `Range.start must be 1st of month. Received ${dateStr} (day ${startDay})`
    );
  }
};

// Validates range.end is the last day of the month
export const validateRangeEndIsLastOfMonth = (dateStr: string) => {
  const endDay = parseInt(dateStr.split("-")[2], 10);
  const [endYear, endMonth] = dateStr.split("-");
  const endMonthDays = new Date(
    parseInt(endYear),
    parseInt(endMonth),
    0
  ).getDate();

  if (endDay !== endMonthDays) {
    throw new Error(
      `Range.end must be last day of month. Received ${dateStr} (day ${endDay}, expected ${endMonthDays})`
    );
  }
};

//  Validate range.start is first day of year
export const validateRangeStartIsFirstDayOfYear = (dateStr: string) => {
  const startDay = parseInt(dateStr.split("-")[2], 10);
  const startMonth = parseInt(dateStr.split("-")[1], 10);
  if (startDay !== 1 || startMonth !== 1) {
    throw new Error(`Range.start must be Jan 1. Received ${dateStr}`);
  }
};

// Validate range.end is last day of year
export const validateRangeEndIsLastDayOfYear = (dateStr: string) => {
  const endDay = parseInt(dateStr.split("-")[2], 10);
  const endMonth = parseInt(dateStr.split("-")[1], 10);
  if (endDay !== 31 || endMonth !== 12) {
    throw new Error(`Range.end must be Dec 31. Received ${dateStr}`);
  }
};
