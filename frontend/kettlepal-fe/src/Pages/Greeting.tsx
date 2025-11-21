import { Box, Heading, Center } from "@chakra-ui/react";
import { useState } from "react";
import Login from "../Components/Auth/Login";
import theme from "../Constants/theme";
import SignUp from "../Components/Auth/SignUp";

export default function Greeting() {
  const [state, setState] = useState({
    formTitle: "Welcome Back!",
    isLeft: false,
  });

  const handleComponentSwap = () => {
    setState((prev) => ({
      formTitle:
        prev.formTitle === "Welcome Back!" ? "Join Us!" : "Welcome Back!",
      isLeft: !prev.isLeft,
    }));
  };

  return (
    <Center
      minH="100%"
      w="100%"
      p="1rem"
      py={["5rem", "5rem", "1rem"]}
      flexWrap="wrap"
      flexDirection="column"
      position="relative"
      overflowX="hidden"
    >
      {/* BACKGROUND CONTENT */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w={["90vw", "75vw", "65vw", "55vw"]}
        h={["90vw", "75vw", "65vw", "55vw"]}
        padding="0px"
        margin="0px"
        border="0px"
        bg={theme.colors.green[100]}
        borderBottomLeftRadius={state.isLeft ? "0" : "100%"}
        borderBottomRightRadius={state.isLeft ? "100%" : "0"}
        zIndex="0"
        boxShadow={`0px 8px 20px 0px ${theme.colors.gray[400]}`}
        display="flex"
        justifyContent={state.isLeft ? "flex-start" : "flex-end"}
        alignItems="flex-start"
        overflow="visible"
        transition="transform 1.75s ease, border-radius 0.75s ease"
        transform={
          state.isLeft
            ? "translateX(0)"
            : [
                "translateX(calc(100vw - 90vw))",
                "translateX(calc(100vw - 75vw))",
                "translateX(calc(100vw - 65vw))",
                "translateX(calc(100vw - 55vw))",
              ]
        }
      >
        <Heading
          fontSize={["2xl", "3xl", "4xl"]}
          color={theme.colors.white}
          textAlign={state.isLeft ? "left" : "right"}
          m={["2rem", "2.5rem"]}
        >
          {state.formTitle}
        </Heading>
      </Box>

      {/* FOREGROUND CONTENT */}
      <Box
        w="calc(100% - 2rem)"
        position="relative"
        maxW="525px"
        p="0"
        m="0"
        transition="transform 1.75s ease-in-out"
        transform={
          state.isLeft
            ? ["0", "0", "translateX(25%)"]
            : ["0", "0", "translateX(-25%)"]
        }
      >
        {state.formTitle === "Welcome Back!" ? (
          <Login handleComponentSwap={handleComponentSwap} />
        ) : (
          <SignUp handleComponentSwap={handleComponentSwap} />
        )}
      </Box>
    </Center>
  );
}
