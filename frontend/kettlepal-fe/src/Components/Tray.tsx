import { HStack, Link, Text } from "@chakra-ui/react";
import React from "react";

export default function Tray() {
  return (
    <HStack
      w="100%"
      h="3rem"
      justifyContent="space-around"
      border="2px solid red"
    >
      <Link href="/">
        <Text>Past Workouts</Text>
      </Link>
      <Link href="new-workout">
        <Text>New Workout</Text>
      </Link>
    </HStack>
  );
}
