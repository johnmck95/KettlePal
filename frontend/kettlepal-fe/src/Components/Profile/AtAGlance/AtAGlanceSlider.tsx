import React, { useState } from "react";
import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  RangeSliderMark,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import theme from "../../../Constants/theme";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { createDateRangeString } from "../../../utils/Time/time";

interface WeeklyRangeSelectorProps {
  dateRange: string;
  setDateRange: (newDateRange: string) => void;
}
/**
 * WEEKLY *
The center of the range slider is at value = 0. 
The min and max of the range slider are +/-7 days from the center. Meaning the user
can see up to 2 weeks of "days" at a time.  Since the slider starts at -3, 3 by default, they see Mon-Sun.
By dragging the slider, additional days will come into view.

To shift the entire time scale left or right, the user can click the left or right arrow buttons respectively.
Since slider values are numbers we can use dayjs to add/subtract the offset from 0 before requerying the DB for updates.

*/
export default function WeeklyRangeSelector({
  dateRange,
  setDateRange,
}: WeeklyRangeSelectorProps) {
  const [center, setCenter] = useState<number>(0);
  const [sliderHandleValues, setSliderHandleValues] = useState<number[]>([
    center - 3,
    center + 3,
  ]);
  const [min, setMin] = useState(-7);
  const [max, setMax] = useState(7);

  // Adjusts view in daily increments. 15 days is maximally viewable.
  const handleSliderChange = (newValues: number[]) => {
    setSliderHandleValues(newValues);
  };

  // Formats to "YYYY-MM-DD,YYYY-MM-DD" based on UI changes
  const updateDateRange = (
    newCenter: number,
    newSliderMin: number,
    newSliderMax: number
  ) => {
    const formattedDateRange = createDateRangeString(
      newSliderMin,
      newSliderMax
    );
    setDateRange(formattedDateRange);
  };

  // Shifts selected range one week back in time.
  const shiftLeft = () => {
    const newCenter = center - 7;
    const newSliderMin = sliderHandleValues[0] - 7;
    const newSliderMax = sliderHandleValues[1] - 7;

    setCenter(newCenter);
    setMin((prevMin) => prevMin - 7);
    setMax((prevMax) => prevMax - 7);
    setSliderHandleValues([newSliderMin, newSliderMax]);
    updateDateRange(newCenter, newSliderMin, newSliderMax);
  };
  // Shifts selected range one week ahead in time.
  const shiftRight = () => {
    const newCenter = center + 7;
    const newSliderMin = sliderHandleValues[0] + 7;
    const newSliderMax = sliderHandleValues[1] + 7;

    setCenter(newCenter);
    setMin((prevMin) => prevMin + 7);
    setMax((prevMax) => prevMax + 7);
    setSliderHandleValues([newSliderMin, newSliderMax]);
    updateDateRange(newCenter, newSliderMin, newSliderMax);
  };

  return (
    <>
      <HStack m="1.5rem 1rem" w="100%">
        <IconButton
          variant="secondary"
          aria-label="Shift graph one week back"
          size="sm"
          icon={<FaArrowLeft />}
          onClick={shiftLeft}
        />
        <RangeSlider
          aria-label={["min", "max"]}
          value={sliderHandleValues}
          onChange={handleSliderChange}
          onChangeEnd={() =>
            updateDateRange(
              center,
              sliderHandleValues[0],
              sliderHandleValues[1]
            )
          }
          min={min}
          max={max}
          m="1rem"
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack bg={theme.colors.green[300]} />
          </RangeSliderTrack>
          <RangeSliderThumb
            boxSize={6}
            index={0}
            bgColor={theme.colors.feldgrau[200]}
            _focus={{
              boxShadow: `0 0 0 3px ${theme.colors.green[50]}`,
            }}
          />
          <RangeSliderThumb
            boxSize={6}
            index={1}
            bgColor={theme.colors.feldgrau[200]}
            _focus={{
              boxShadow: `0 0 0 3px ${theme.colors.green[50]}`,
            }}
          />

          {/* <RangeSliderMark
            value={sliderHandleValues[0]}
            mt="3"
            ml="-2.5"
            fontSize="sm"
          >
            {sliderHandleValues[0]}
          </RangeSliderMark>
          <RangeSliderMark value={center} mt="3" ml="-2.5" fontSize="sm">
            {center}
          </RangeSliderMark>
          <RangeSliderMark
            value={sliderHandleValues[1]}
            mt="3"
            ml="-2.5"
            fontSize="sm"
          >
            {sliderHandleValues[1]}
          </RangeSliderMark> */}
        </RangeSlider>

        <IconButton
          variant="secondary"
          aria-label="Shift graph one week forward"
          size="sm"
          icon={<FaArrowRight />}
          onClick={shiftRight}
        />
      </HStack>
      <h2>{dateRange}</h2>
    </>
  );
}
