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
      border={`1px solid ${theme.colors.gray[200]}`}
      borderRadius="6px"
    >
      <Center
        h="35%"
        bg={theme.colors.feldgrau[500]}
        borderRadius="6px 6px 0 0"
        color={theme.colors.white}
        overflow="hidden"
        whiteSpace="nowrap"
        m="-1px"
      >
        <Text
          overflow="hidden"
          textOverflow={"ellipsis"}
          fontSize="sm"
          fontWeight={600}
        >
          {convertedDate.format("MMM").toLocaleUpperCase()}
        </Text>
      </Center>
      <Center fontSize="x-large" h="50%">
        <Text
          overflow="hidden"
          textOverflow={"ellipsis"}
          fontSize="lg"
          fontWeight={"bold"}
        >
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
