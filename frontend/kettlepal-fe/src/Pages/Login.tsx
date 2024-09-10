import {
  Center,
  VStack,
  Text,
  FormLabel,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Alert,
  HStack,
  AlertIcon,
  AlertDescription,
  InputRightElement,
  InputGroup,
  CloseButton,
} from "@chakra-ui/react";
import react, { ChangeEvent, useEffect, useState } from "react";
import theme from "../Constants/theme";
import { gql, useMutation } from "@apollo/client";
import { useUser } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      uid
      firstName
      lastName
      email
      isAuthorized
      createdAt
    }
  }
`;

export default function Login() {
  const [state, setState] = react.useState({
    email: "",
    password: "",
    submitted: false,
  });
  const [showPassword, setShowPassword] = react.useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const { user, login } = useUser();
  const navigate = useNavigate();

  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login) {
        login(data.login);
        navigate("/new-workout");
      } else {
        console.error("Login failed: ", error);
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState((prevState) => ({ ...prevState, submitted: true }));
    try {
      await loginMutation({
        variables: { email: state.email, password: state.password },
      });
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleGuestLogin = async () => {
    const guestEmail = "test_account@gmail.com";
    const guestPassword = "badPassword";
    try {
      await loginMutation({
        variables: { email: guestEmail, password: guestPassword },
      });
    } catch (error) {
      console.error("Error logging in as guest: ", error);
    }
  };

  const emailIsInvalid = state.submitted && state.email === "";
  const passwordIsInvalid = state.submitted && state.password === "";

  const [showServerError, setShowServerError] = useState<boolean>(true);
  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  // Redirect to workouts page if user is already logged in
  useEffect(() => {
    if (user !== null) {
      navigate("/new-workout");
    }
  }, [user, navigate]);

  return (
    <Center h="100%" w="100%" flexDirection="column">
      <Center
        maxW="600px"
        maxH="450px"
        w="calc(100% - 2rem)"
        m="1rem"
        p="4rem 1rem 4rem 1rem"
        borderRadius="8px"
        boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
      >
        <VStack w="100%" p="1rem">
          {/* TITLE */}
          <Text fontSize="xl" my="1rem">
            Log In
          </Text>

          {/* EMAIL */}
          <FormControl isRequired mb="0.5rem" isInvalid={emailIsInvalid}>
            <FormLabel fontSize="xs">Email Address</FormLabel>
            <Input
              name="email"
              value={state.email}
              onChange={handleChange}
              type="email"
              focusBorderColor={theme.colors.green[300]}
            />
            <FormErrorMessage>Email is required.</FormErrorMessage>
          </FormControl>

          {/* PASSWORD */}
          <FormControl isRequired isInvalid={passwordIsInvalid}>
            <FormLabel fontSize="xs">Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                value={state.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                focusBorderColor={theme.colors.green[300]}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSubmit(event);
                }}
              />
              <InputRightElement width="4.5rem">
                <Button
                  w="75px"
                  h="80%"
                  mr="0.25rem"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setShowPassword((prevShowPassword) => !prevShowPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>Password is required.</FormErrorMessage>
          </FormControl>

          {/* SUBMIT */}
          <Button
            variant="primary"
            w="100%"
            mt="2rem"
            type="submit"
            isLoading={loading}
            _hover={{ bg: theme.colors.green[100] }}
            onClick={handleSubmit}
          >
            Log In
          </Button>

          {/* CONTINUE AS GUEST */}
          <Text w="100%" mt="1rem" fontSize="xs" color={theme.colors.grey[700]}>
            Don't have an account? Take a look around as a{" "}
            <Button
              variant="link"
              fontSize="sm"
              color={theme.colors.green[600]}
              onClick={handleGuestLogin}
            >
              guest.
            </Button>
          </Text>

          <Text w="100%" fontSize="8px" color={theme.colors.grey[600]}>
            <i>We are not offering new accounts at this time.</i>
          </Text>
        </VStack>
      </Center>

      {/* LOGIN ERROR */}
      {error && showServerError && (
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
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}
    </Center>
  );
}
