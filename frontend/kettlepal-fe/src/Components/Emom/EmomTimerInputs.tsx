import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  Text,
  NumberInputStepper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import theme from "../../Constants/theme";
import { useMemo, useState } from "react";

import { CreateOrUpdateWorkoutState } from "../../Hooks/HookHelpers/validation";
import { LinkedEmomTab } from "./LinkedEmomTab";
import { ManualEmomTab } from "./ManualEmomTab";
import { FaLink, FaKeyboard } from "react-icons/fa";

export default function EmomTimerInputs({
  exercises,
  onClose,
  onProceed,
}: {
  exercises: CreateOrUpdateWorkoutState["exercises"];
  onClose: () => void;
  onProceed: (config: any) => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);

  const [manualRounds, setManualRounds] = useState(10);
  const [linkedExerciseKeys, setLinkedExerciseKeys] = useState<string[]>([]);
  const [startDelaySeconds, setStartDelaySeconds] = useState(10);

  const mode = tabIndex === 0 ? "linked" : "manual";

  const derivedRounds = useMemo(() => {
    return exercises
      .filter((e) => linkedExerciseKeys.includes(e.key as string))
      .reduce((sum, e) => sum + (Number(e.sets.value) || 0), 0);
  }, [exercises, linkedExerciseKeys]);

  const isValid =
    mode === "manual"
      ? manualRounds > 0
      : linkedExerciseKeys.length > 0 && derivedRounds > 0;

  const handleProceed = () => {
    onProceed(
      mode === "manual"
        ? {
            mode: "manual",
            rounds: manualRounds,
            startDelaySeconds,
          }
        : {
            mode: "linked",
            exerciseKeys: linkedExerciseKeys,
            rounds: derivedRounds,
            startDelaySeconds,
          }
    );
  };
  return (
    <>
      <ModalBody>
        <Tabs
          colorScheme="green"
          isFitted
          index={tabIndex}
          onChange={setTabIndex}
        >
          <TabList>
            {/* TABS */}
            <Tab>
              <HStack spacing={2}>
                <Icon as={FaLink} />
                <Text>Exercises</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FaKeyboard} />
                <Text>Manual</Text>
              </HStack>
            </Tab>
          </TabList>

          {/* TABLE PANELS */}
          <TabPanels mt={2}>
            <TabPanel w="100%" p={2}>
              <Box
                bg={theme.colors.grey[50]}
                borderWidth="1px"
                borderColor={theme.colors.grey[100]}
                borderRadius="lg"
                p={4}
                w="100%"
                boxShadow="md"
              >
                <LinkedEmomTab
                  exercises={exercises}
                  selectedExerciseKeys={linkedExerciseKeys}
                  onChange={setLinkedExerciseKeys}
                />
              </Box>
            </TabPanel>

            <TabPanel>
              <Box
                bg={theme.colors.grey[50]}
                borderWidth="1px"
                borderColor={theme.colors.grey[200]}
                borderRadius="lg"
                p={5}
                boxShadow="sm"
              >
                <ManualEmomTab
                  rounds={manualRounds}
                  onChange={setManualRounds}
                />
              </Box>
            </TabPanel>
          </TabPanels>

          {/* STARTS IN */}
          <Box p={"1rem"} mt="1rem">
            <FormControl>
              <FormLabel>Start In (s)</FormLabel>
              <NumberInput
                min={0}
                value={startDelaySeconds}
                onChange={(_, prev) => setStartDelaySeconds(prev)}
                focusBorderColor={theme.colors.green[300]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormHelperText>
                The time until the first exercise begins.
              </FormHelperText>
            </FormControl>
          </Box>
        </Tabs>
      </ModalBody>
      <ModalFooter>
        <Flex w="100%" justifyContent="space-between">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>

          <Button
            onClick={handleProceed}
            isDisabled={!isValid}
            variant="primary"
          >
            Proceed
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
}
