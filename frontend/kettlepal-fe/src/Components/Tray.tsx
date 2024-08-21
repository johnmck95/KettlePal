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
      bg="linear-gradient(180deg, rgba(90,114,92,1) 0%, rgba(90,114,92,1) 28%, rgba(81,103,83,1) 94%)"
    >
      <Link href="/">
        <IconButton
          aria-label="Past-Workouts"
          icon={<FaListAlt />}
          size={["sm", "md"]}
          color="white"
          variant="ghost"
          sx={{
            _hover: {
              backgroundColor: "olive.300",
            },
            _active: {
              backgroundColor: "olive.500",
            },
          }}
        />
      </Link>
      <Link href="new-workout">
        <IconButton
          aria-label="New-Workout"
          icon={<FaPlusCircle />}
          size={["sm", "md"]}
          color="white"
          variant="ghost"
          sx={{
            _hover: {
              backgroundColor: "olive.300",
            },
            _active: {
              backgroundColor: "olive.500",
            },
          }}
        />
      </Link>
    </HStack>
  );
}
