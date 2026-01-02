import {
  Heading,
  IconButton,
  VStack,
  Text,
  Box,
  Grid,
  Icon,
  Alert,
  AlertIcon,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import React from "react";
import theme from "../../Constants/theme";
import { FaCheckCircle, FaPencilAlt } from "react-icons/fa";
import { useUser } from "../../Contexts/UserContext";
import { RepsDisplayOptions } from "../../Constants/ExercisesOptions";

interface ViewSettingsProps {
  showUploadSuccess: boolean;
  toggleEditMode: () => void;
}

export default function ViewSettings({
  showUploadSuccess,
  toggleEditMode,
}: ViewSettingsProps) {
  const user = useUser().user;
  const templates = user?.templates || [];

  return (
    <VStack maxW={"1086px"} mx="auto" my="1rem">
      {/* USERNAME & CONTROLS */}
      <Grid
        w={["96%", "90%"]}
        borderBottom={`2px solid ${theme.colors.green[600]}`}
        templateColumns="1fr auto 1fr"
        alignItems="center"
        p="0.5rem"
      >
        <Box />
        <Heading
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          justifySelf="center"
        >
          {user?.firstName + " " + user?.lastName}
        </Heading>
        <IconButton
          aria-label="Settings"
          icon={<FaPencilAlt />}
          onClick={toggleEditMode}
          variant="secondary"
          size="sm"
          px={0}
          mx={0}
          justifySelf="end"
        />
      </Grid>

      <Box w={["96%", "90%"]} m={2} color="gray.700">
        {/* BODY WEIGHT */}
        <Text fontSize={["xs", "sm", "md"]} mx="0.25rem">
          <b>BODY WEIGHT: </b> {user?.bodyWeight + " " + user?.bodyWeightUnit}
        </Text>
        <Box
          borderBottom={`2px solid ${theme.colors.green[100]}`}
          mt={6}
          mb={4}
          px="0.25rem"
          fontWeight="bold"
        >
          <Text fontSize={["md", "lg", "xl"]}>EXERCISE TEMPLATES</Text>
        </Box>

        {/* USER HASN'T ADDED CUSTOM TEMPLATES */}
        {templates.length <= 0 ? (
          <>
            <Text
              my="4rem"
              color={theme.colors.grey[600]}
              fontSize={["md", "lg", "xl"]}
              textAlign={"center"}
              fontWeight={"semibold"}
            >
              You're using the default Exercise Templates.
            </Text>

            <Text
              m="2rem 0.5rem 1rem 0.5rem"
              mb="1.5rem"
              mt="3rem"
              color={theme.colors.gray[600]}
              fontSize={["sm", "md", "lg"]}
              fontWeight={600}
            >
              <u>Custom Exercise Templates let you control:</u>
            </Text>

            <List spacing={3} mx="1.75rem" fontSize={["xs", "sm", "md"]}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                The exercises available in the{" "}
                <b>
                  <i>New Workout</i>{" "}
                </b>
                page.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                The ability to apply{" "}
                <b>
                  <i>Multiplers</i>
                </b>
                , enabling you to fine tune the work capacity of each exercise.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Create{" "}
                <b>
                  <i>Body Weight Exercises</i>
                </b>{" "}
                that use your weight to compute work capacity.
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Choose the Default{" "}
                <b>
                  <i>Unit & Type</i>
                </b>{" "}
                per exercise to quickly format workouts.
              </ListItem>
            </List>

            <Text
              my="2rem"
              mx="0.5rem"
              color="gray.600"
              fontSize={["xs", "sm", "md"]}
            >
              Click the <Icon as={FaPencilAlt} mx="0.25rem" /> icon to create
              your Exercise Templates now!
            </Text>
          </>
        ) : (
          <>
            {/* TABLE HEADERS */}
            <Grid
              templateColumns="24% 17% 9% 22% 21%"
              gap={2}
              borderBottom={`3px solid ${theme.colors.green[50]}`}
              fontSize={["xs", "sm", "md"]}
              fontWeight="semibold"
              px="0.25rem"
            >
              <Box>EXERCISE</Box>
              <Box>TYPE</Box>
              <Box>UNIT</Box>
              <Box>RESISTANCE</Box>
              <Box>MULTIPLIER</Box>
            </Grid>

            {/* TABLE ROWS */}
            <VStack align="stretch" spacing={0}>
              {templates.map((template) => (
                <Grid
                  key={template.index}
                  templateColumns="24% 17% 9% 22% 21%"
                  fontSize={["xs", "sm", "md"]}
                  alignItems="center"
                  borderBottom={`1px solid ${theme.colors.green[50]}`}
                  _hover={{
                    bg: theme.colors.grey[50],
                    color: "black",
                  }}
                  py={4}
                  gap={2}
                  px="0.5rem"
                  borderRadius="2px"
                >
                  <Box>{template.title}</Box>
                  <Box>
                    {RepsDisplayOptions.find(
                      (option) => option.value === template.repsDisplay
                    )?.label ?? ""}
                  </Box>
                  <Box>{template.weightUnit ?? user?.bodyWeightUnit}</Box>
                  <Box>
                    {template.isBodyWeight ? "Body Weight" : "Weighted"}
                  </Box>
                  <Box>{template.multiplier.toFixed(2)}</Box>
                </Grid>
              ))}
            </VStack>
          </>
        )}
        {showUploadSuccess && (
          <Alert status="success" my="1rem" borderRadius={"8px"} bg="green.50">
            <AlertIcon />
            <VStack ml="1rem" align={"flex-start"}>
              <Text fontWeight="semibold">Settings Updated Successfully!</Text>
              <Text>Log a new workout to see your templates in action.</Text>
            </VStack>
          </Alert>
        )}
      </Box>
    </VStack>
  );
}
