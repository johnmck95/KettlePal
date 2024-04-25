import { HStack, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import { FaPlusCircle, FaListAlt } from "react-icons/fa";
import theme from "../Constants/theme";

export default function Tray() {
  return (
    <HStack
      w="100%"
      h="3rem"
      justifyContent="space-around"
      borderTop={`1px solid ${theme.colors.olive[700]}`}
      boxShadow={"0 -2px 4px rgba(0, 0, 0, 0.1)"}
    >
      <Link href="/">
        <IconButton
          aria-label="Past-Workouts"
          icon={<FaListAlt />}
          size={["sm", "md"]}
          variant="outline"
          color="olive.700"
        />
      </Link>
      <Link href="new-workout">
        <IconButton
          aria-label="New-Workout"
          icon={<FaPlusCircle />}
          size={["sm", "md"]}
          variant="outline"
          color="olive.700"
        />
      </Link>
    </HStack>
  );
}
