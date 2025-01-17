import {
  Box,
  Heading,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";
import { useUser } from "../../Contexts/UserContext";
import theme from "../../Constants/theme";
import Detail from "../ViewWorkouts/ViewDetailedWorkoutModal/Detail";

export default function UserStats() {
  const user = useUser().user;
  return (
    <Box
      h="100%"
      bg={theme.colors.white}
      borderRadius="8px"
      boxShadow={`0px 0.5px 1px ${theme.colors.grey[400]}`}
      p="0"
    >
      <VStack py="1rem">
        <Heading fontSize="2xl">
          {user?.firstName + " " + user?.lastName}
        </Heading>
        <HStack w="100%" justifyContent="space-evenly" my="1rem">
          <Detail title="Total Workouts" value="345" variant="md" />
          <Detail title="Favourite Exercise" value="Swing" variant="md" />
          <Detail title="Days Active" value="28%" variant="md" />
        </HStack>

        <TableContainer>
          <Table variant="simple" size={["xs", "sm", "md"]}>
            {/* LIFETIME TOTAL */}
            <Thead>
              <Tr>
                <Th fontSize={["xl"]}>Lifetime Totals</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Member Since</Td>
                <Td fontSize={["xs", "sm", "md"]}>September 3, 2024</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Total Workouts</Td>
                <Td fontSize={["xs", "sm", "md"]}>345</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Total Exercises</Td>
                <Td fontSize={["xs", "sm", "md"]}>1254</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Total Time</Td>
                <Td fontSize={["xs", "sm", "md"]}>123 hours 34 min</Td>
              </Tr>
            </Tbody>

            {/* BEST EFFORTS */}
            <Thead>
              <Tr>
                <Th fontSize={["xs", "sm", "md"]}>BEST EFFORTS</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Longest Workout</Td>
                <Td fontSize={["xs", "sm", "md"]}>2hr, 34mins</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Greatest Work Capacity</Td>
                <Td fontSize={["xs", "sm", "md"]}>11,234kg</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>Most Reps</Td>
                <Td fontSize={["xs", "sm", "md"]}>634</Td>
              </Tr>
            </Tbody>

            {/* FAVOURITE EXERCISES */}
            <Thead>
              <Tr>
                <Th fontSize={["xs", "sm", "md"]}>FAVOURITE EXERCISES</Th>
                <Th fontSize={["xs", "sm", "md"]}> TOTAL WORKOUTS</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>SA SWING</Td>
                <Td fontSize={["xs", "sm", "md"]}>134</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>PRESS</Td>
                <Td fontSize={["xs", "sm", "md"]}>87</Td>
              </Tr>
              <Tr>
                <Td fontSize={["xs", "sm", "md"]}>SWING</Td>
                <Td fontSize={["xs", "sm", "md"]}>85</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
}
