import {
  Box,
  Flex,
  Select,
  Heading,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import theme from "../../Constants/theme";
import { RadioGroup } from "../UI/RadioCard";
import { useUser } from "../../Contexts/UserContext";
import { useUnqiueExerciseTitlesQuery } from "../../generated/frontend-types";
import LoadingSpinner from "../LoadingSpinner";

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
    "Time" | "Work Capacity"
  >("Work Capacity");
  const metrics = ["Time", "Work Capacity"];
  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric as "Time" | "Work Capacity");
  };

  const user = useUser().user;
  const { loading, error, data } = useUnqiueExerciseTitlesQuery({
    variables: {
      userUid: user?.uid ?? "",
    },
  });
  const uniqueExerciseTitles = data?.uniqueExerciseTitles ?? [];

  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  return (
    <Box
      bg={theme.colors.white}
      borderRadius="8px"
      boxShadow={`0px 1px 2px ${theme.colors.grey[400]}`}
      p="1rem"
    >
      <Heading
        fontSize="2xl"
        fontWeight="bold"
        pb="0.5rem"
        mb="0.5rem"
        textAlign="center"
        borderBottom={`1px solid ${theme.colors.green[50]}`}
      >
        Your {selectedPeriod} {selectedExercise} Progression
      </Heading>
      {showServerError && (
        <Alert
          status="error"
          my="1rem"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <AlertDescription>{error?.message}</AlertDescription>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}
      <Flex
        w="100%"
        h="350px"
        bg={theme.colors.feldgrau[100]}
        borderRadius="10px"
        justifyContent={"center"}
        alignItems={"center"}
        color={theme.colors.white}
      >
        {loading ? (
          <LoadingSpinner size={16} disableMessage={true} />
        ) : (
          <>{selectedMetric} - Coming Soon..</>
        )}
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
          {uniqueExerciseTitles.map((title) => (
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
