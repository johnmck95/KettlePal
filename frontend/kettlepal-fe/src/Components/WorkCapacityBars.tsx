import { Box, Flex, Text } from "@chakra-ui/react";
import { ExerciseAggregate } from "../generated/frontend-types";
import { weightLabel } from "../utils/Visualiations/constants";

interface Props {
  activeBucket: ExerciseAggregate | null;
  colourMap: Map<string, string>;
}

const WorkCapacityBars = ({ activeBucket, colourMap }: Props) => {
  return (
    <>
      {activeBucket ? (
        <Box w="100%" maxW="320px">
          {activeBucket.workCapacityComponents.map((component) => {
            const percentage =
              activeBucket.totalWorkCapacityKg > 0
                ? (component.workCapacityKg /
                    activeBucket.totalWorkCapacityKg) *
                  100
                : 100;

            const weightKey = weightLabel(component);
            const colour = colourMap.get(weightKey) ?? "gray.400";

            return (
              <Box key={weightKey} mb={1}>
                <Flex justify="space-between" mb={0}>
                  <Text fontSize={["xs", "sm"]} fontWeight="medium">
                    {weightKey}
                  </Text>

                  <Text fontSize={["xs", "sm"]}>{percentage.toFixed(0)}%</Text>
                </Flex>

                <Box
                  width="100%"
                  height={["6px", "6px"]}
                  bg="gray.200"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Box
                    height="100%"
                    width={`${percentage}%`}
                    bg={colour}
                    transition="width 0.3s ease"
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          width="100%"
          maxW="360px"
          py={4}
          px={3}
          border="1px dashed"
          borderColor="gray.300"
          borderRadius="md"
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.500">
            Hover over the graph to see the distrubution of work capacity.
          </Text>
        </Box>
      )}
    </>
  );
};

export default WorkCapacityBars;
