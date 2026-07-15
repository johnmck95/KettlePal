import {
  Alert,
  AlertDescription,
  AlertIcon,
  Center,
  CloseButton,
  FormControl,
  FormLabel,
  HStack,
  Select,
  VStack,
} from "@chakra-ui/react";
import {
  ExerciseTrendsResponse,
  useExerciseTrendsQuery,
} from "../../generated/frontend-types";
import theme from "../../Constants/theme";
import { useEffect, useState } from "react";
import { useUser } from "../../Contexts/UserContext";
import LoadingSpinner from "../LoadingSpinner";

export default function ExerciseTrends() {
  //TODO: Fetch unique exercises from DB
  const userRecordedExercises = ["Clean", "Swing", "Press", "Squat"];
  const [exerciseTitle, setExerciseTitle] = useState(userRecordedExercises[0]);
  const user = useUser().user;
  const [showServerError, setShowServerError] = useState<boolean>(false);

  const { loading, error, data } = useExerciseTrendsQuery({
    variables: { uid: user?.uid ?? "", exerciseTitle },
  });

  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);
  console.log(data);

  return (
    <VStack
      w="90%"
      pt="2rem"
      mt="2rem"
      borderTop={`2px solid ${theme.colors.green[100]}`}
    >
      {showServerError ? (
        <Alert
          status="error"
          m="0.5rem"
          w="90%"
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
      ) : (
        <>
          {loading ? (
            <Center h="100%" w="100%">
              <LoadingSpinner disableMessage={true} />
            </Center>
          ) : (
            <FormControl>
              <FormLabel>Exercise</FormLabel>
              <Select
                size={["sm", "sm", "md"]}
                fontSize={["16px"]}
                placeholder={"Select"}
                name="exercise"
                focusBorderColor={theme.colors.green[300]}
                color={theme.colors.black}
                bg={theme.colors.white}
                value={exerciseTitle}
                onChange={(event) => setExerciseTitle(event.target.value)}
              >
                {userRecordedExercises.map((exercise) => {
                  return (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </>
      )}
    </VStack>
  );
}
