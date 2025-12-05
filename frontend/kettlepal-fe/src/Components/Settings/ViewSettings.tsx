import {
  Heading,
  IconButton,
  VStack,
  Text,
  Box,
  Grid,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { SettingsState } from "../../Pages/Settings";
import theme from "../../Constants/theme";
import { FaPencilAlt } from "react-icons/fa";
import { useUser } from "../../Contexts/UserContext";
import { RepsDisplayOptions } from "../../Constants/ExercisesOptions";

interface ViewSettingsProps {
  handleState: React.Dispatch<React.SetStateAction<SettingsState>>;
}

export default function ViewSettings({ handleState }: ViewSettingsProps) {
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
          onClick={() => handleState((prev) => ({ ...prev, edit: !prev.edit }))}
          variant="secondary"
          size="sm"
          px={0}
          mx={0}
          justifySelf="end"
        />
      </Grid>

      {/* BODY WEIGHT */}
      <Box w={["96%", "90%"]} m={2} color="gray.700">
        <Text fontSize={["xs", "sm", "md"]}>
          <b>BODY WEIGHT: </b> {user?.bodyWeight + " " + user?.bodyWeightUnit}
        </Text>
        <Box
          borderBottom={`2px solid ${theme.colors.green[100]}`}
          mt={6}
          mb={4}
          fontWeight="bold"
        >
          <Text fontSize={["md", "lg", "xl"]}>EXERCISE TEMPLATES</Text>
        </Box>

        {/* USER HASN'T ADDED CUSTOM TEMPLATES */}
        {templates.length <= 0 ? (
          <>
            <Text my="0.75rem" color="gray.600" fontSize={["xs", "sm", "md"]}>
              Looks like you're using the default KettlePal Exercises.
            </Text>

            <Text color="gray.600" fontSize={["xs", "sm", "md"]}>
              For complete control over the exercises, units, and formats you
              see in the "New" page, click the{" "}
              <Icon as={FaPencilAlt} mx="0.25rem" /> icon to customize your
              experience!
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
                  _hover={{ bg: theme.colors.green[25] }}
                  py={4}
                  gap={2}
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
                  <Box>{template.multiplier}</Box>
                </Grid>
              ))}
            </VStack>
          </>
        )}
      </Box>
    </VStack>
  );
}
