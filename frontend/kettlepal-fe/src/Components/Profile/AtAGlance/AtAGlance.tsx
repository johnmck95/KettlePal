import {
  Box,
  Center,
  HStack,
  VStack,
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
import Graph from "./Visualization/Graph";
import Detail from "../../ViewWorkouts/ViewDetailedWorkoutModal/Detail";
import { formatTime } from "../../../utils/Time/time";

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

  const totalTime = data?.user?.atAGlance?.data?.reduce((total, item) => {
    const elapsedSeconds = item?.elapsedSeconds ?? 0;
    return total + elapsedSeconds;
  }, 0);
  const totalWorkCapacityKg = data?.user?.atAGlance?.data?.reduce(
    (total, item) => {
      const workCapacityKg = item?.workCapacityKg ?? 0;
      return total + workCapacityKg;
    },
    0
  );

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
        <VStack>
          <HStack justifyContent="space-evenly" w="100%">
            <Detail
              title="Total Time"
              value={formatTime(totalTime ?? 0, true) || "0 mins"}
              variant="sm"
            />
            <Detail
              title="Total Work Capacity"
              value={(totalWorkCapacityKg ?? 0).toLocaleString() + " kg"}
              variant="sm"
            />
          </HStack>
          <Box w="100%" minH="400px">
            {data?.user?.atAGlance?.data && data?.user?.atAGlance?.period && (
              <Graph
                data={data?.user?.atAGlance?.data}
                period={selectedPeriod}
                visualizeField={selectedMetric}
              />
            )}
          </Box>
        </VStack>
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
