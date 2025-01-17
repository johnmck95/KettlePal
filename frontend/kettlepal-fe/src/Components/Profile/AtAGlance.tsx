import { Box, Flex, HStack, Heading } from "@chakra-ui/react";

import React from "react";
import theme from "../../Constants/theme";
import { RadioGroup } from "../UI/RadioCard";

export default function AtAGlance() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "Week" | "Month" | "Year" | "Lifetime"
  >("Week");
  const periods = ["Week", "Month", "Year", "Lifetime"];
  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period as "Week" | "Month" | "Year" | "Lifetime");
  };

  const [selectedMetric, setSelectedMetric] = React.useState<
    "Reps" | "Work Capacity"
  >("Work Capacity");
  const metrics = ["Reps", "Work Capacity"];
  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric as "Reps" | "Work Capacity");
  };

  return (
    <Box
      bg={theme.colors.white}
      borderRadius="8px"
      boxShadow={`0px 1px 2px ${theme.colors.grey[400]}`}
      p="1rem"
    >
      <HStack mb="1rem">
        <Heading fontSize="xl">Your {selectedPeriod} At a Glance</Heading>
      </HStack>
      <Flex
        w="100%"
        h="350px"
        bg={theme.colors.feldgrau[100]}
        borderRadius="10px"
        justifyContent={"center"}
        alignItems={"center"}
      >
        {selectedMetric}
      </Flex>
      <HStack
        mt="0.5rem"
        mb="0rem"
        justifyContent={"space-evenly"}
        flexWrap="wrap"
        gap="1rem"
      >
        <RadioGroup
          items={periods}
          selected={selectedPeriod}
          handleClick={handlePeriodClick}
        />
        <RadioGroup
          items={metrics}
          selected={selectedMetric}
          handleClick={handleMetricClick}
        />
      </HStack>
    </Box>
  );
}
