import { Text, VStack } from "@chakra-ui/react";
import React from "react";
import theme from "../../../Constants/theme";

export default function Detail({
  title,
  value,
  variant = "sm",
  color,
}: {
  title: string;
  value: string;
  variant?: "sm" | "md";
  color?: string;
}) {
  return (
    <VStack gap={0}>
      <Text
        fontSize={variant === "sm" ? ["10px", "12px"] : ["12px", "14px"]}
        color={theme.colors.grey[700]}
      >
        {title}
      </Text>
      <Text
        fontSize={variant === "sm" ? ["14px", "16px"] : ["16px", "20px"]}
        color={color}
      >
        <b>{value}</b>
      </Text>
    </VStack>
  );
}
