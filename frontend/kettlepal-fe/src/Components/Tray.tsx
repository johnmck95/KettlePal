import {
  HStack,
  Link,
  VStack,
  Text,
  Icon,
  Center,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Alert,
} from "@chakra-ui/react";
import React from "react";
import { FaPlusCircle, FaListAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useUser } from "../Contexts/UserContext";
import LoadingSpinner from "./LoadingSpinner";
import { useLogoutMutation } from "../generated/frontend-types";

export default function Tray() {
  const { user, logout } = useUser();
  const [showError, setShowError] = React.useState(false);
  const [logoutMutation, { loading, error }] = useLogoutMutation({
    fetchPolicy: "no-cache",
    onCompleted() {
      // Only update the UserContext state if the token is successfully invalidated
      logout();
    },
    onError: (e) => {
      console.log("Error logging out: ", e);
      setShowError(true);
    },
  });

  const handleLogout = async () => {
    // Invalidate the auth tokens on the server
    await logoutMutation();
  };

  return (
    <>
      {(loading || showError) && (
        <Center
          position="absolute"
          top="0"
          w="100%"
          h="calc(100vh - 3rem)"
          bg="radial-gradient(circle, rgba(242,242,242,1) 35%, rgba(247,247,245,1) 52%, rgba(250,249,246,1) 76%)"
          zIndex={3}
        >
          {loading && <LoadingSpinner />}
          {showError && (
            <Alert
              status="error"
              mt="2rem"
              maxW="600px"
              w="calc(100% - 2rem)"
              borderRadius={"8px"}
              justifyContent={"space-between"}
            >
              <HStack>
                <AlertIcon />
                <AlertDescription>{error?.message}</AlertDescription>
              </HStack>
              <CloseButton
                alignSelf="flex-start"
                onClick={() => setShowError(false)}
              />
            </Alert>
          )}
        </Center>
      )}
      <HStack
        w="100%"
        h="4rem"
        justifyContent="space-around"
        bg="linear-gradient(180deg, rgba(90,114,92,1) 0%, rgba(90,114,92,1) 28%, rgba(81,103,83,1) 94%)"
        color="white"
      >
        {user && (
          <>
            <Link h="100%" w="55px" onClick={handleLogout}>
              <VStack justifyContent={"center"} gap={0} my="auto">
                <Icon
                  as={FaSignOutAlt}
                  aria-label="Logout"
                  sx={{
                    mt: "6px",
                    width: "1.5rem",
                    height: "2rem",
                  }}
                />
                <Text
                  fontSize={["10px"]}
                  color="white"
                  w="100%"
                  textAlign="center"
                >
                  Logout
                </Text>
              </VStack>
            </Link>

            <Link href="workouts" h="100%" w="55px">
              <VStack justifyContent={"center"} gap={0} my="auto">
                <Icon
                  as={FaListAlt}
                  aria-label="Past-Workouts"
                  sx={{
                    mt: "6px",
                    width: "1.5rem",
                    height: "2rem",
                  }}
                />
                <Text
                  fontSize={["10px"]}
                  color="white"
                  w="100%"
                  textAlign="center"
                >
                  Past
                </Text>
              </VStack>
            </Link>

            <Link href="profile" h="100%" w="55px">
              <VStack justifyContent={"center"} gap={0} my="auto">
                <Icon
                  as={FaUser}
                  aria-label="Profile"
                  sx={{
                    mt: "6px",
                    width: "1.5rem",
                    height: "2rem",
                  }}
                />
                <Text
                  fontSize={["10px"]}
                  color="white"
                  w="100%"
                  textAlign="center"
                >
                  Profile
                </Text>
              </VStack>
            </Link>

            <Link href="new-workout" h="100%" w="55px">
              <VStack justifyContent={"center"} gap={0} my="auto">
                <Icon
                  as={FaPlusCircle}
                  aria-label="New-Workout"
                  sx={{
                    mt: "6px",
                    width: "1.5rem",
                    height: "2rem",
                  }}
                />
                <Text
                  fontSize={["10px"]}
                  color="white"
                  w="100%"
                  textAlign="center"
                >
                  New
                </Text>
              </VStack>
            </Link>
          </>
        )}
      </HStack>
    </>
  );
}
