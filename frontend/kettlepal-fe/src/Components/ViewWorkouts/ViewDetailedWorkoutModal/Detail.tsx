import { Text, VStack } from "@chakra-ui/react";
import React from "react";
import theme from "../../../Constants/theme";

export default function Detail({
  title,
  value,
  variant = "sm",
}: {
  title: string;
  value: string;
  variant?: "sm" | "md";
}) {
  return (
    <VStack gap={0}>
      <Text
        fontSize={variant === "sm" ? ["8px", "12px"] : ["xs", "sm"]}
        color={theme.colors.grey[700]}
      >
        {title}
      </Text>
      <Text fontSize={variant === "sm" ? ["14px", "18px"] : ["lg", "xl"]}>
        <b>{value}</b>
      </Text>
    </VStack>
  );
}
