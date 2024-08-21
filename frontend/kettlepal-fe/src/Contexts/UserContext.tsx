import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { User } from "../Constants/types";
import theme from "../Constants/theme";
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
  const { loading, error, data } = useQuery(GET_USERS);

  // Currently, you need to manually delete the user from localStorage to "logout"
  const [selectedUser, setSelectedUser] = useState<any | undefined>(() => {
    const storedUser = localStorage.getItem("selectedUser");
    return storedUser ? JSON.parse(storedUser) : undefined;
  });
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="100vw"
        h="100vh"
      >
        <Center
          w="80%"
          h="80%"
          borderRadius="10px"
          boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
        >
          <VStack display="flex" justifyContent={"center"}>
            <LoadingSpinner />
            <Text
              p="1rem"
              maxWidth="400px"
              fontSize="1.2rem"
              textAlign="justify"
            >
              KettlePal's backend service automatically spins down after a
              period of inactivity. This is a cost saving measure. Please be
              patient while a brand new service is being spun up just for you!
              This may take a minutes.
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="100vw"
        h="100vh"
      >
        <Center
          w="80%"
          h="80%"
          borderRadius="10px"
          boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
        >
          <Text>
            An unexpected error has occurred. The team has been notified -
            please check back soon.
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <UserContext.Provider value={selectedUser}>
      {selectedUser ? (
        children
      ) : (
        <Center>
          <VStack>
            <Heading as="h1" fontSize="xx-large">
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
