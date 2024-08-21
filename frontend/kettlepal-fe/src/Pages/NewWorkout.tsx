import React from "react";
import CreateWorkout from "../Components/NewWorkouts/CreateWorkout";
import { Flex } from "@chakra-ui/react";

export default function NewWorkout() {
  return (
    <Flex w="100%" justifyContent={"center"}>
      <CreateWorkout />
    </Flex>
  );
}
