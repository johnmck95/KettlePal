import { Box, Heading, Center } from "@chakra-ui/react";
import react, { useState } from "react";
import Login from "../Components/Auth/Login";
import theme from "../Constants/theme";
import Register from "../Components/Auth/Register";

export default function Greeting() {
  const [state, setState] = useState({
    formTitle: "Welcome Back!",
    isLeft: false,
  });

  const handleHeadingClick = () => {
    setState((prev) => ({
      formTitle:
        prev.formTitle === "Welcome Back!" ? "Join Us!" : "Welcome Back!",
      isLeft: !prev.isLeft,
    }));
  };

  return (
    <Center
      minH="100vh"
      p="1rem"
      flexWrap="wrap"
      flexDirection="column"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left={state.isLeft ? "0" : "auto"}
        right={state.isLeft ? "auto" : "0"}
        w={["90vw", "75vw", "65vw", "55vw"]}
        h={["90vw", "75vw", "65vw", "55vw"]}
        bg={theme.colors.green[100]}
        borderBottomLeftRadius={state.isLeft ? "0" : "100%"}
        borderBottomRightRadius={state.isLeft ? "100%" : "0"}
        zIndex="0"
        boxShadow={`0px 8px 20px 0px ${theme.colors.gray[400]}`}
        display="flex"
        justifyContent={state.isLeft ? "flex-start" : "flex-end"}
        alignItems="flex-start"
        p={["2rem", "4rem", "6rem", "10rem"]}
        transition="all .75s ease"
        overflow="visible"
        transform="none"
      >
        <Heading
          fontSize="xl"
          my="1rem"
          color={theme.colors.white}
          onClick={handleHeadingClick}
          textDecoration="underline"
          cursor="pointer"
        >
          {state.formTitle}
        </Heading>
      </Box>
      <Box position="relative">
        {/* Foreground content */}
        {state.formTitle === "Welcome Back!" ? <Login /> : <Register />}
      </Box>
    </Center>
  );
}
