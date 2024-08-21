import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./Constants/theme";
import { Routes, Route } from "react-router-dom";
import PastWorkouts from "./Pages/PastWorkouts";
import NewWorkout from "./Pages/NewWorkout";
import Tray from "./Components/Tray";
import UserProvider from "./Contexts/UserContext";

export const App = () => (
  <ChakraProvider theme={theme}>
    <UserProvider>
      <Box
        h="calc(100vh - 3rem)"
        overflowY={"scroll"}
        bg="radial-gradient(circle, rgba(242,242,242,1) 35%, rgba(247,247,245,1) 52%, rgba(250,249,246,1) 76%)"
      >
        <Routes>
          <Route path="/" element={<PastWorkouts />} />
          <Route path="/new-workout" element={<NewWorkout />} />
        </Routes>
      </Box>
      <Tray />
    </UserProvider>
  </ChakraProvider>
);
