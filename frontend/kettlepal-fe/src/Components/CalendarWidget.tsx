import React from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import theme from "../Constants/theme";

export default function CalendarWidget({
  date,
  w,
  h,
}: {
  date: string;
  w?: string;
  h?: string;
}) {
  const convertedDate = dayjs(date).tz(dayjs.tz.guess() ?? "America/Vancouver");

  return (
    <Box
      w={w}
      h={h ?? w}
      border={`3px solid ${theme.colors.feldgrau[500]}`}
      color={theme.colors.olive[900]}
      borderRadius="10px"
    >
      <Center
        h="35%"
        bg={theme.colors.feldgrau[500]}
        color={theme.colors.white}
        overflow="hidden"
        whiteSpace="nowrap"
      >
        <Text overflow="hidden" textOverflow={"ellipsis"}>
          {convertedDate.format("MMM")}
        </Text>
      </Center>
      <Center fontSize="x-large" h="50%">
        <Text overflow="hidden" textOverflow={"ellipsis"}>
          {convertedDate.format("DD")}
        </Text>
      </Center>
      <Center fontSize={"xx-small"} h="15%">
        <Text overflow="hidden" textOverflow={"ellipsis"}>
          {convertedDate.format("YYYY")}
        </Text>
      </Center>
    </Box>
  );
}
