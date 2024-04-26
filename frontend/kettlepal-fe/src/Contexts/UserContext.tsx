import React, { createContext, useContext, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

/** A TEMPORARY (terrible) WAY OF HANDLING USER LOGIN */
/** because I want to work on the fun stuff.. */

const GET_USERS = gql`
  query {
    users {
      uid
      first_name
      last_name
      email
      is_authorized
      created_at
    }
  }
`;

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  isAuthorized: boolean;
  createdAt: number;
}

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
export const useUser = () => useContext(UserContext);

export default function UserProvider({
  children,
}: UserProviderProps): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<any | undefined>(undefined);
  const { loading, error, data } = useQuery(GET_USERS);

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

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

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
                onClick={() =>
                  handleUserSelect({
                    uid: user.uid,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    isAuthorized: user.is_authorized,
                    createdAt: user.created_at,
                  })
                }
              >
                <Text>
                  {user.first_name} {user.last_name}
                </Text>
              </Button>
            ))}
          </VStack>
        </Center>
      )}
    </UserContext.Provider>
  );
}
