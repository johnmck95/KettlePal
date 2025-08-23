import { useEffect } from "react";
import AtAGlanceRangeSlider from "./AtAGlanceRangeSlider";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

interface MonthlyRangeSelectorProps {
  dateRange: string;
  setDateRange: (newDateRange: string) => void;
}

dayjs.extend(isoWeek);

export default function MonthlyRangeSelector({
  dateRange,
  setDateRange,
}: MonthlyRangeSelectorProps) {
  const middleOfMonth = dayjs()
    .startOf("month")
    .add(Math.floor(dayjs().daysInMonth() / 2), "day");
  const firstMondayOfMonth = dayjs().startOf("month").startOf("isoWeek");
  const weeksFromFirstMonday = -middleOfMonth.diff(firstMondayOfMonth, "week");
  const lastSundayOfMonth = dayjs().endOf("month").endOf("isoWeek");
  const weeksFromLastSunday = -middleOfMonth.diff(lastSundayOfMonth, "week");

  const min = -4;
  const max = 4;
  const sliderHandleValues: [number, number] = [
    weeksFromFirstMonday,
    weeksFromLastSunday,
  ];

  return (
    <AtAGlanceRangeSlider
      min={min}
      max={max}
      sliderHandleValues={sliderHandleValues}
      dateRange={dateRange}
      setDateRange={setDateRange}
      selectedDateRange="Month"
    />
  );
}
