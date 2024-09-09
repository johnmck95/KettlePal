import { HStack, Link, VStack, Text, Icon } from "@chakra-ui/react";
import React from "react";
import { FaPlusCircle, FaListAlt, FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../Contexts/UserContext";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    invalidateToken
  }
`;

export default function Tray() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [logoutMutation, { loading, error }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      navigate("/");
    },
  });
  const handleLogout = async () => {
    try {
      logout();
      await logoutMutation();
    } catch (e) {
      console.log("Error logging out: ", e);
    }
  };

  return (
    <HStack
      w="100%"
      h="3rem"
      justifyContent="space-around"
      bg="linear-gradient(180deg, rgba(90,114,92,1) 0%, rgba(90,114,92,1) 28%, rgba(81,103,83,1) 94%)"
      color="white"
    >
      {user && (
        <>
          <Link href="/" h="100%" w="55px" onClick={handleLogout}>
            <VStack justifyContent={"center"} gap={0} my="auto">
              <Icon
                as={FaSignOutAlt}
                aria-label="Logout"
                sx={{
                  mt: "6px",
                  width: "1.5rem",
                  height: "1.5rem",
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
                  height: "1.5rem",
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

          <Link href="new-workout" h="100%" w="55px">
            <VStack justifyContent={"center"} gap={0} my="auto">
              <Icon
                as={FaPlusCircle}
                aria-label="New-Workout"
                sx={{
                  mt: "6px",
                  width: "1.5rem",
                  height: "1.5rem",
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
  );
}
