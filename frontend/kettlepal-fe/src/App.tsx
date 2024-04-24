import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

const TEST_QUERY = gql`
  query UserWithWorkouts($uid: ID!) {
    user(uid: $uid) {
      first_name
      last_name
      workouts {
        uid
        comment
        start_time
        exercises {
          uid
          title
          sets
          reps
          start_time
          end_time
        }
      }
    }
  }
`;

function TestComponent() {
  const { loading, error, data } = useQuery(TEST_QUERY, {
    variables: { uid: "2247ece1-ee83-4600-92bf-549f0d73ea6f" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return <div>{JSON.stringify(data)}</div>;
}

export const App = () => (
  <ChakraProvider theme={theme}>
    <TestComponent />
  </ChakraProvider>
);
