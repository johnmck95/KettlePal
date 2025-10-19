import {
  Center,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  Alert,
  HStack,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import theme from "../../Constants/theme";
import { useSignUpMutation } from "../../generated/frontend-types";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";

export default function SignUp({
  handleComponentSwap,
}: {
  handleComponentSwap: () => void;
}) {
  const initialErrors = {
    firstName: { isInvalid: false, message: "" },
    lastName: { isInvalid: false, message: "" },
    email: { isInvalid: false, message: "" },
    password: { isInvalid: false, message: "" },
    confirmPassword: { isInvalid: false, message: "" },
  };

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    submitted: false,
    showPassword: false,
    errors: initialErrors,
  });
  const { user, login, error: contextError } = useUser();
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateForm();
  }

  const [signUpMutation, { loading, error }] = useSignUpMutation({
    onCompleted: (data) => {
      if (data?.signUp) {
        login();
        navigate("/new-workout");
      } else {
        console.error("Sign up failed: ", error);
      }
    },
  });

  function validateForm() {
    let isValid = true;

    // Clear previous errors
    setState((prevState) => ({
      ...prevState,
      errors: initialErrors,
    }));

    // Validate First Name
    if (state.firstName.trim().length === 0) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          firstName: {
            isInvalid: true,
            message: "First Name is required",
          },
        },
      }));
      isValid = false;
    }

    // Validate Last Name
    if (state.lastName.trim().length === 0) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          lastName: {
            isInvalid: true,
            message: "Last Name is required",
          },
        },
      }));
      isValid = false;
    }

    // Validate Email - required and valid format
    if (state.email.trim().length === 0) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          email: {
            isInvalid: true,
            message: "Email is required",
          },
        },
      }));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          email: {
            isInvalid: true,
            message: "Email is invalid",
          },
        },
      }));
      isValid = false;
    }

    // Validate Password - required and min 8 chars
    if (state.password.length === 0) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          password: {
            isInvalid: true,
            message: "Password is required",
          },
        },
      }));
      isValid = false;
    } else if (state.password.length < 8) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          password: {
            isInvalid: true,
            message: "Password must be at least 8 characters",
          },
        },
      }));
      isValid = false;
    }

    // Validate Confirm Password - required and matches password
    if (state.confirmPassword.length === 0) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          confirmPassword: {
            isInvalid: true,
            message: "Please confirm your password",
          },
        },
      }));
      isValid = false;
    } else if (state.confirmPassword !== state.password) {
      setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          confirmPassword: {
            isInvalid: true,
            message: "Passwords do not match",
          },
        },
      }));
      isValid = false;
    }

    return isValid;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState((prevState) => ({ ...prevState, submitted: true }));

    const formIsValid = validateForm();
    if (formIsValid) {
      try {
        await signUpMutation({
          variables: {
            user: {
              firstName: state.firstName.trim(),
              lastName: state.lastName.trim(),
              email: state.email.trim(),
              password: state.password,
            },
          },
        });
      } catch (error) {
        console.error("Error signing up: ", error);
      }
    }
  };

  const [showServerError, setShowServerError] = useState<boolean>(true);
  useEffect(() => {
    if (error || contextError) {
      setShowServerError(true);
    }
  }, [error, contextError]);

  useEffect(() => {
    if (error || contextError) {
      setShowServerError(true);
    }
  }, [error, contextError]);

  // Redirect to workouts page if user is already logged in
  useEffect(() => {
    if (user !== null) {
      navigate("/new-workout");
    }
  }, [user, navigate]);

  const [excessLoading, setExcessLoading] = useState<boolean>(false);
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setExcessLoading(true);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <>
      <Center
        my="auto"
        bg="white"
        maxW="500px"
        w="calc(100% - 2rem)"
        minW={["100%", "430px"]}
        p="2rem 1rem 1rem 1rem"
        borderRadius="24px"
        boxShadow={`0px 2px 8px ${theme.colors.grey[400]}`}
      >
        <VStack w="100%" p="1rem">
          {/* TITLE */}
          <Text fontSize="xl" my="1rem">
            Sign Up
          </Text>

          {/* FIRST NAME */}
          <FormControl
            isRequired
            mb="0.5rem"
            isInvalid={state.submitted && state.errors.firstName.isInvalid}
          >
            <FormLabel fontSize="xs">First Name</FormLabel>
            <Input
              name="firstName"
              value={state.firstName}
              onChange={handleChange}
              type="text"
              focusBorderColor={theme.colors.green[300]}
            />
            <FormErrorMessage>
              {state.errors.firstName.message}
            </FormErrorMessage>
          </FormControl>

          {/* LAST NAME */}
          <FormControl
            isRequired
            mb="0.5rem"
            isInvalid={state.submitted && state.errors.lastName.isInvalid}
          >
            <FormLabel fontSize="xs">Last Name</FormLabel>
            <Input
              name="lastName"
              value={state.lastName}
              onChange={handleChange}
              type="text"
              focusBorderColor={theme.colors.green[300]}
            />
            <FormErrorMessage>{state.errors.lastName.message}</FormErrorMessage>
          </FormControl>

          {/* EMAIL */}
          <FormControl
            isRequired
            mb="0.5rem"
            isInvalid={state.submitted && state.errors.email.isInvalid}
          >
            <FormLabel fontSize="xs">Email Address</FormLabel>
            <Input
              name="email"
              value={state.email}
              onChange={handleChange}
              type="email"
              focusBorderColor={theme.colors.green[300]}
            />
            <FormErrorMessage>{state.errors.email.message}</FormErrorMessage>
          </FormControl>

          {/* PASSWORD */}
          <FormControl
            isRequired
            isInvalid={state.submitted && state.errors.password.isInvalid}
          >
            <FormLabel fontSize="xs">Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                value={state.password}
                onChange={handleChange}
                type={state.showPassword ? "text" : "password"}
                focusBorderColor={theme.colors.green[300]}
              />
              <InputRightElement width="4.5rem">
                <Button
                  w="75px"
                  h="80%"
                  mr="0.25rem"
                  variant="secondary"
                  size="sm"
                  tabIndex={-1}
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      showPassword: !prevState.showPassword,
                    }))
                  }
                >
                  {state.showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{state.errors.password.message}</FormErrorMessage>
          </FormControl>

          {/* CONFIRM PASSWORD */}
          <FormControl
            isRequired
            isInvalid={
              state.submitted && state.errors.confirmPassword.isInvalid
            }
          >
            <FormLabel fontSize="xs">Password</FormLabel>
            <InputGroup>
              <Input
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={handleChange}
                type={state.showPassword ? "text" : "password"}
                focusBorderColor={theme.colors.green[300]}
              />
              <InputRightElement width="4.5rem">
                <Button
                  w="75px"
                  h="80%"
                  mr="0.25rem"
                  variant="secondary"
                  size="sm"
                  tabIndex={-1}
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      showPassword: !prevState.showPassword,
                    }))
                  }
                >
                  {state.showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {state.errors.confirmPassword.message}
            </FormErrorMessage>
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
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            Sign Up
          </Button>
          {excessLoading && (
            <Text fontSize="xs" color={theme.colors.grey[500]}>
              <i>
                KettlePal's backend service automatically spins down after a
                period of inactivity. This is because Kettlepal is built
                entirely on free serivces. You will need to restart the
                application in 30-90 seconds.
              </i>
            </Text>
          )}

          {/* LOG IN HERE */}
          <Text w="100%" mt="1rem" fontSize="xs" color={theme.colors.grey[700]}>
            <i>
              Already have an account?{" "}
              <Button
                variant="link"
                fontSize="sm"
                color={theme.colors.green[900]}
                onClick={handleComponentSwap}
                textDecoration="underline"
                textAlign={"center"}
              >
                Log in here
              </Button>
            </i>
          </Text>
        </VStack>
      </Center>

      {/* SIGN UP ERROR */}
      {(error || contextError) && showServerError && (
        <Alert
          status="error"
          my="1rem"
          maxW="500px"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <VStack alignItems={"flex-start"}>
              {error?.message && (
                <AlertDescription>{error?.message}</AlertDescription>
              )}
              {contextError?.message && (
                <AlertDescription>{contextError?.message}</AlertDescription>
              )}
            </VStack>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}
    </>
  );
}
