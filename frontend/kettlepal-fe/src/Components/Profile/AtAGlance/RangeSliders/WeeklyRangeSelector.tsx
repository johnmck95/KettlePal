import React, { useEffect } from "react";
import AtAGlanceRangeSlider from "./AtAGlanceRangeSlider";

interface WeeklyRangeSelectorProps {
  dateRange: string;
  setDateRange: (newDateRange: string) => void;
}

/**
 * The center of the range slider is at value = 0.
 * The min and max of the range slider are +/-7 days from the center. Meaning the user
 * can see a max of 15 days of data at a time.  Since the slider is initialized at -3, 3,
 * they see Mon-Sun. By dragging the slider, additional days will come & go from view.
 *
 * To shift the entire time 'window' left or right by one week (min/max amount), the user
 * can click the arrows on the left and right of the slider respectively.
 */

export default function WeeklyRangeSelector({
  dateRange,
  setDateRange,
}: WeeklyRangeSelectorProps) {
  const min = -7;
  const max = 7;
  const sliderHandleValues: [number, number] = [-3, 3];

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
