import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./Constants/theme";
import { Routes, Route } from "react-router-dom";
import PastWorkouts from "./Pages/PastWorkouts";
import NewWorkout from "./Pages/NewWorkout";
import Tray from "./Components/Tray";
import { UserProvider } from "./Contexts/UserContext";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import SessionChecker from "./Components/Auth/SessionChecker";
import Profile from "./Pages/Profile";
import Greeting from "./Pages/Greeting";
import Settings from "./Pages/Settings";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <SessionChecker />
        <Box
          h="calc(100vh - 4rem)"
          overflowY="auto"
          bg="radial-gradient(circle, rgba(242,242,242,1) 35%, rgba(247,247,245,1) 52%, rgba(250,249,246,1) 76%)"
        >
          <Routes>
            <Route path="/" element={<Greeting />} />
            <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <PastWorkouts />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-workout"
              element={
                <PrivateRoute>
                  <NewWorkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
        <Tray />
      </UserProvider>
    </ChakraProvider>
  );
};
