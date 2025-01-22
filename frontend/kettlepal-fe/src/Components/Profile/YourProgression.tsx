import { Box, Flex, Select, Heading, HStack } from "@chakra-ui/react";
import React from "react";
import theme from "../../Constants/theme";
import { RadioGroup } from "../UI/RadioCard";
import ExerciseTitles from "../../Constants/ExercisesOptions";

export default function YourProgression() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "Weekly" | "Monthly" | "Yearly" | "Lifetime"
  >("Weekly");
  const periods = ["Weekly", "Monthly", "Yearly", "Lifetime"];
  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period as "Weekly" | "Monthly" | "Yearly" | "Lifetime");
  };

  const [selectedExercise, setSelectedExercise] =
    React.useState("Single Arm Swing");
  const handleExerciseChange = (exercise: string) => {
    setSelectedExercise(exercise as "Week" | "Month" | "Year" | "Lifetime");
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
      <Heading fontSize="xl" mb="1rem">
        Your {selectedPeriod} {selectedExercise} Progression
      </Heading>
      <Flex
        w="100%"
        h="350px"
        bg={theme.colors.feldgrau[100]}
        borderRadius="10px"
        justifyContent={"center"}
        alignItems={"center"}
        color={theme.colors.white}
      >
        {selectedMetric} - Graph coming soon..
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
        <Select
          flex="1 1 180px"
          mx="2rem"
          focusBorderColor={theme.colors.green[300]}
          onChange={(event) => handleExerciseChange(event.target.value)}
          size={["xs", "sm", "md"]}
        >
          {ExerciseTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </Select>
        <RadioGroup
          items={metrics}
          selected={selectedMetric}
          handleClick={handleMetricClick}
        />
      </HStack>
    </Box>
  );
}
