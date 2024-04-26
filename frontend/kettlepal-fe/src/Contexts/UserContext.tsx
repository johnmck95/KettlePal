import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { User } from "../Constants/types";

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
      <Center>
        <Heading>Loading...</Heading>
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Heading>Error: {error.message}</Heading>
      </Center>
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
