import * as React from "react";
import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import PastWorkouts from "./Pages/PastWorkouts";
import NewWorkout from "./Pages/NewWorkout";
import Tray from "./Components/Tray";

export const App = () => (
  <ChakraProvider theme={theme}>
    {/* <TestComponent /> */}
    <Box h="calc(100vh - 50px)" border="2px solid green">
      <Routes>
        <Route path="/" element={<PastWorkouts />} />
        <Route path="/new-workout" element={<NewWorkout />} />
      </Routes>
    </Box>
    <Tray />
  </ChakraProvider>
);
