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
import theme from "../../../../Constants/theme";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { createDateRangeString } from "../../../../utils/Time/time";

interface AtAGlanceRangeSliderProps {
  dateRange: string;
  setDateRange: (newDateRange: string) => void;
  min: number;
  max: number;
  sliderHandleValues: [number, number];
}

/**
 * The center of the range slider is at value = 0.
 * The min and max of the range slider are initMin/initMax time units from the center.
 * Meaning the user can see a max of initMin -> initMax units of data at a time.
 * The slider is initialized at initSliderHandleValues, for exmaple, to see Mon-Sun.
 * By dragging the slider, additional units will come & go from view.
 *
 * To shift the entire time 'window' left or right by one initMin/initMax unit,
 * the user can click the arrows on the left and right of the slider respectively.
 */

export default function AtAGlanceRangeSlider({
  dateRange,
  setDateRange,
  min: initMin,
  max: initMax,
  sliderHandleValues: initSliderHandleValues,
}: AtAGlanceRangeSliderProps) {
  const [center, setCenter] = useState<number>(0);
  const [sliderHandleValues, setSliderHandleValues] = useState<number[]>([
    center + initSliderHandleValues[0],
    center + initSliderHandleValues[1],
  ]);
  const [min, setMin] = useState(initMin);
  const [max, setMax] = useState(initMax);

  // Adjusts view in individual increments. min -> max maximally viewable.
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
    const newCenter = center + initMin;
    const newSliderMin = sliderHandleValues[0] + initMin;
    const newSliderMax = sliderHandleValues[1] + initMin;

    setCenter(newCenter);
    setMin((prevMin) => prevMin + initMin);
    setMax((prevMax) => prevMax + initMin);
    setSliderHandleValues([newSliderMin, newSliderMax]);
    updateDateRange(newSliderMin, newSliderMax);
  };
  // Shifts selected range one week ahead in time.
  const shiftRight = () => {
    const newCenter = center + initMax;
    const newSliderMin = sliderHandleValues[0] + initMax;
    const newSliderMax = sliderHandleValues[1] + initMax;

    setCenter(newCenter);
    setMin((prevMin) => prevMin + initMax);
    setMax((prevMax) => prevMax + initMax);
    setSliderHandleValues([newSliderMin, newSliderMax]);
    updateDateRange(newSliderMin, newSliderMax);
  };

  return (
    <VStack w="100%" spacing={0}>
      <HStack m="1.5rem 1rem" w="100%">
        <IconButton
          variant="secondary"
          aria-label="Shift graph back"
          size="sm"
          icon={<FaArrowLeft />}
          onClick={shiftLeft}
        />
        <RangeSlider
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
          aria-label="Shift graph forward"
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
