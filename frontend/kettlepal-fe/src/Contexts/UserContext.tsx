import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { User } from "../Constants/types";
import LoadingSpinner from "../Components/LoadingSpinner";

/** A TEMPORARY (terrible) WAY OF HANDLING USER LOGIN */
/** because I want to work on the fun stuff.. */

const GET_USERS = gql`
  query {
    users {
      uid
      firstName
      lastName
      email
      isAuthorized
      createdAt
    }
  }
`;

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<User>({
  uid: "",
  firstName: "",
  lastName: "",
  email: "",
  isAuthorized: false,
  createdAt: 0,
});
export const useUser = () => useContext<User>(UserContext);

export default function UserProvider({
  children,
}: UserProviderProps): JSX.Element {
  const { loading, error, data } = useQuery(GET_USERS, {
    fetchPolicy: "cache-first",
  });

  // Currently, you need to manually delete the user from sessionStorage to "logout"
  const [selectedUser, setSelectedUser] = useState<any | undefined>(() => {
    const storedUser = sessionStorage.getItem("selectedUser");
    return storedUser ? JSON.parse(storedUser) : undefined;
  });
  useEffect(() => {
    if (selectedUser) {
      sessionStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

  // if (loading && !selectedUser) {
  // NOTE: !selectedUser may have been causing an infinte loading screen on inital fetch after prod server spins down
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="space-between"
        w="100vw"
        h="100vh"
        background="url(https://media.gettyimages.com/id/503416862/photo/man-ready-to-exercise-with-kettle-bell.jpg?s=612x612&w=0&k=20&c=LOP7VZUq1-A7Ct4kMkxXp8UV5hUahetCliwef9tiQoI=)"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition={"center"}
      >
        <VStack display="flex" justifyContent={"flex-start"} mt="2.5rem">
          <LoadingSpinner size={24} />
        </VStack>
      </Box>
    );
  }

  if (error) {
    console.log(error?.message);
    return (
      <Box>
        <Alert
          status="error"
          w="calc(100% - 4rem)"
          m="2rem"
          borderRadius={"8px"}
        >
          <AlertIcon />
          <AlertDescription>
            An unexpected error has occurred. {error?.message}
          </AlertDescription>
        </Alert>
      </Box>
    );
  }
  return (
    <UserContext.Provider value={selectedUser}>
      {selectedUser ? (
        children
      ) : (
        <Center
          display="flex"
          justifyContent="center"
          alignItems="space-between"
          w="100vw"
          h="100vh"
          background="url(https://media.gettyimages.com/id/503416862/photo/man-ready-to-exercise-with-kettle-bell.jpg?s=612x612&w=0&k=20&c=LOP7VZUq1-A7Ct4kMkxXp8UV5hUahetCliwef9tiQoI=)"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          backgroundPosition={"center"}
        >
          <VStack alignSelf="center">
            <Heading
              as="h1"
              fontSize="xxx-large"
              color="white"
              textShadow="2px 2px 4px rgba(0, 0, 0, 1)"
            >
              Dev Mode - Login As:
            </Heading>
            {data.users.map((user: any) => (
              <Button
                key={user.uid}
                border="1px solid grey"
                padding="0.5rem 1rem"
                margin="1rem"
                borderRadius={"0.25rem"}
                onClick={() => setSelectedUser(user)}
              >
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
              </Button>
            ))}
          </VStack>
        </Center>
      )}
    </UserContext.Provider>
  );
}
