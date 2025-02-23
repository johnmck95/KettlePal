import { useEffect } from "react";
import AtAGlanceRangeSlider from "./AtAGlanceRangeSlider";

interface MonthlyRangeSelectorProps {
  dateRange: string;
  setDateRange: (newDateRange: string) => void;
}

export default function MonthlyRangeSelector({
  dateRange,
  setDateRange,
}: MonthlyRangeSelectorProps) {
  const min = -2;
  const max = 2;
  const sliderHandleValues: [number, number] = [-2, 2];

  // useEffect(() => {
  //   setDateRange("TODO,TODO");
  // });

  return (
    <AtAGlanceRangeSlider
      min={min}
      max={max}
      sliderHandleValues={sliderHandleValues}
      dateRange={dateRange}
      setDateRange={setDateRange}
    />
  );
}
