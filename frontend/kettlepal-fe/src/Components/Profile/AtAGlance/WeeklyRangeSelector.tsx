import React, { useState } from "react";
import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Heading,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import theme from "../../../Constants/theme";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { createDateRangeString } from "../../../utils/Time/time";

interface WeeklyRangeSelectorProps {
  dateRange: string;
  setDateRange: (newDateRange: string) => void;
}

/**
 * The center of the range slider is at value = 0.
 * The min and max of the range slider are +/-7 days from the center. Meaning the user
 * can see a max of 2 weeks of data at a time.  Since the slider is initialized at -3, 3,
 * they see Mon-Sun. By dragging the slider, additional days will come & go from view.
 *
 * To shift the entire time 'window' left or right by one week, the user can click the
 * arrows on the left and right of the slider respectively.
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
  const updateDateRange = (newSliderMin: number, newSliderMax: number) => {
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
    updateDateRange(newSliderMin, newSliderMax);
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
    updateDateRange(newSliderMin, newSliderMax);
  };

  return (
    <VStack w="100%" spacing={0}>
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
            updateDateRange(sliderHandleValues[0], sliderHandleValues[1])
          }
          min={min}
          max={max}
          mx="1rem"
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
        </RangeSlider>

        <IconButton
          variant="secondary"
          aria-label="Shift graph one week forward"
          size="sm"
          icon={<FaArrowRight />}
          onClick={shiftRight}
        />
      </HStack>
      <Heading size="sm" m="-0.25rem 0 0.75rem 0">{`${
        dateRange.split(",")[0]
      } - ${dateRange.split(",")[1]}`}</Heading>
    </VStack>
  );
}
