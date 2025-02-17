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

interface WeeklyRangeSelectorProps {
  selectedPeriod: "Week" | "Month" | "Year" | "Lifetime";
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
  selectedPeriod,
}: WeeklyRangeSelectorProps) {
  const [center, setCenter] = useState<number>(0);
  const [sliderHandleValues, setSliderHandleValues] = useState<number[]>([
    center - 3,
    center + 3,
  ]);
  const min = -7;
  const max = 7;

  const handleSliderChange = (newValues: number[]) => {
    setSliderHandleValues(newValues);
  };

  const refetch = () => {
    console.log("done changing");
  };

  const shiftLeft = () => {
    setCenter((prevCenter) => prevCenter - 1);
    setSliderHandleValues([
      sliderHandleValues[0] - 1,
      sliderHandleValues[1] - 1,
    ]);
    refetch();
  };
  const shiftRight = () => {
    setCenter((prevCenter) => prevCenter + 1);
    setSliderHandleValues([
      sliderHandleValues[0] + 1,
      sliderHandleValues[1] + 1,
    ]);
    refetch();
  };

  return (
    <HStack m="1.5rem 1rem" w="100%">
      <IconButton
        variant="secondary"
        aria-label="One week back"
        size="sm"
        icon={<FaArrowLeft />}
        onClick={shiftLeft}
        isDisabled={sliderHandleValues[0] === min}
      />
      <RangeSlider
        aria-label={["min", "max"]}
        value={sliderHandleValues}
        onChange={handleSliderChange}
        onChangeEnd={refetch}
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

        <RangeSliderMark
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
        </RangeSliderMark>
      </RangeSlider>
      <IconButton
        variant="secondary"
        aria-label="One week forward"
        size="sm"
        icon={<FaArrowRight />}
        onClick={shiftRight}
        isDisabled={sliderHandleValues[1] === max}
      />
    </HStack>
  );
}
