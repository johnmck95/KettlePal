import React from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import theme from "../../../../Constants/theme";
import { FormattedData } from "./Graph";
import { formatDate, formatTime } from "../../../../utils/Time/time";

interface TooltipProps {
  content: FormattedData[0];
  position: { x: number; y: number };
}

export default function Tooltip({ content, position }: TooltipProps) {
  return (
    <Box
      position="absolute"
      left={`${position.x}px`}
      top={`${position.y}px`}
      padding="1rem"
      border={`1px solid ${theme.colors.grey[400]}`}
      borderRadius={5}
      backgroundColor={theme.colors.white}
      zIndex={2}
      minWidth="250px"
      minHeight="125px"
    >
      <VStack alignItems="flex-start" w="100%">
        <Text>
          <b>Date:</b>{" "}
          {content.startDate.getTime() === content.endDate.getTime()
            ? formatDate(content.startDate)
            : `${formatDate(content.startDate)} - ${formatDate(
                content.endDate
              )}`}
        </Text>
        <Text>
          <b>Time:</b>{" "}
          {formatTime(content.elapsedSeconds ?? 0, true) || "0 mins"}
        </Text>
        <Text>
          <b>Work Capacity:</b> {content.workCapacityKg?.toLocaleString()}kg
        </Text>
      </VStack>
    </Box>
  );
}
