import {
  Box,
  Center,
  HStack,
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import theme from "../../../Constants/theme";
import { RadioGroup } from "../../UI/RadioCard";
import { useAtAGlanceQuery } from "../../../generated/frontend-types";
import { useUser } from "../../../Contexts/UserContext";
import LoadingSpinner from "../../LoadingSpinner";
import Visualization from "./Visualization";

export default function AtAGlance() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "Week" | "Month" | "Year" | "Lifetime"
  >("Week");
  const periods = ["Week", "Month", "Year", "Lifetime"];
  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period as "Week" | "Month" | "Year" | "Lifetime");
  };

  const [selectedMetric, setSelectedMetric] = React.useState<
    "Time" | "Work Capacity"
  >("Time");
  const metrics = ["Time", "Work Capacity"];
  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric as "Time" | "Work Capacity");
  };

  const user = useUser().user;
  const { loading, error, data } = useAtAGlanceQuery({
    variables: {
      uid: user?.uid ?? "",
      period: selectedPeriod,
      dateRange: "TODO",
    },
  });

  const [showServerError, setShowServerError] = useState<boolean>(false);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  console.log("AT A GLANCE");
  return (
    <Box
      bg={theme.colors.white}
      borderRadius="8px"
      boxShadow={`0px 1px 2px ${theme.colors.grey[400]}`}
      p="1rem"
      // minH="462px"
    >
      <HStack mb="1rem">
        <Heading fontSize="xl">Your {selectedPeriod} At a Glance</Heading>
      </HStack>
      {showServerError && (
        <Alert
          status="error"
          m="3rem 1rem 1rem 1rem"
          w="calc(100% - 2rem)"
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
      {loading ? (
        <Center w="100%" minH="400px">
          <LoadingSpinner size={16} disableMessage={true} />
        </Center>
      ) : (
        <Box w="100%" minH="400px">
          {data?.user?.atAGlance?.data && data?.user?.atAGlance?.period && (
            <Visualization
              data={data?.user?.atAGlance?.data}
              period={selectedPeriod}
              visualizeField={selectedMetric}
            />
          )}
        </Box>
      )}
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
