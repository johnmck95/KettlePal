import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FaClock, FaDumbbell } from "react-icons/fa";
import theme from "../Constants/theme";

interface Props {
  metric: "time" | "workCapacity";
  value: string;
}

export default function KeyMetricCard({ metric, value }: Props) {
  const isTime = metric === "time";

  const icon = isTime ? FaClock : FaDumbbell;

  const colours = isTime
    ? {
        accent: theme.colors.graphPrimary[500],
        bg: theme.colors.graphPrimary[100],
      }
    : {
        accent: theme.colors.graphSecondary[500],
        bg: theme.colors.graphSecondary[100],
      };

  return (
    <Flex
      w="100%"
      h="100%"
      p={[2, 3, 4]}
      bg="#F8F8F6"
      borderRadius="xl"
      boxShadow="0 1px 3px rgba(0,0,0,0.05)"
      align="center"
      gap={[3, 4, 5]}
    >
      <Flex
        w={["48px", "52px", "68px"]}
        h={["48px", "52px", "68px"]}
        borderRadius="full"
        bg={colours.bg}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Icon
          as={icon}
          boxSize={["20px", "22px", "28px"]}
          color={colours.accent}
        />
      </Flex>

      <Box>
        <Text
          fontSize={["xs", "sm"]}
          fontWeight="medium"
          color={theme.colors.grey[600]}
          letterSpacing="0.02em"
          mb={0.5}
        >
          {isTime ? "Time" : "Work Capacity"}
        </Text>

        <Text
          fontSize={["md", "lg", "xl"]}
          fontWeight="700"
          lineHeight={1.1}
          color={colours.accent}
        >
          {value}
        </Text>
      </Box>
    </Flex>
  );
}
