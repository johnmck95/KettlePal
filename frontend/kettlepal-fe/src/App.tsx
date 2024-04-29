import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./Constants/theme";
import { Routes, Route } from "react-router-dom";
import PastWorkouts from "./Pages/PastWorkouts";
import NewWorkout from "./Pages/NewWorkout";
import Tray from "./Components/Tray";

export const App = () => (
  <ChakraProvider theme={theme}>
    {/* <TestComponent /> */}
    <Box h="calc(100vh - 3rem)" overflowY={"scroll"}>
      <Routes>
        <Route path="/" element={<PastWorkouts />} />
        <Route path="/new-workout" element={<NewWorkout />} />
      </Routes>
    </Box>
    <Tray />
  </ChakraProvider>
);
