import {
  Box,
  Text,
  Grid,
  HStack,
  Heading,
  IconButton,
  VStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Center,
} from "@chakra-ui/react";
import React from "react";
import theme from "../../Constants/theme";
import { FaPlusCircle, FaSave, FaTimes } from "react-icons/fa";
import BodyWeightSettings from "../NewWorkouts/FormComponents/Settings/User/BodyWeightSettings";
import BodyWeightUnitSettings from "../NewWorkouts/FormComponents/Settings/User/BodyWeightUnitSettings";
import { AnimatePresence, motion } from "framer-motion";
import useEditSettings, { SettingErrors } from "../../Hooks/useEditSettings";
import EditTemplate from "./EditTemplate";
import ConfirmModal from "../ConfirmModal";
import LoadingSpinner from "../LoadingSpinner";

interface EditSettingsProps {
  toggleEditMode: () => void;
  setShowUploadSuccess: (show: boolean) => void;
}

export default function EditSettings({
  setShowUploadSuccess,
  toggleEditMode,
}: EditSettingsProps) {
  const {
    state,
    user,
    loading,
    isOpenSaveSettings,
    serverError,
    showServerError,
    errors,
    submitted,
    setShowServerError,
    onOpenSaveSettings,
    onSaveSettings,
    onCloseSaveSettings,
    handleTemplate,
    handleStateChange,
    deleteTemplate,
    moveTemplateIndex,
    handleAddTemplate,
    setFormHasErrors,
  } = useEditSettings({ setShowUploadSuccess, toggleEditMode });

  const bodyWeightExercisesWithoutUserWeight = state.templates.reduce(
    (acc, template) => {
      if (
        !acc &&
        template.isBodyWeight &&
        (state.bodyWeight === "" || state.bodyWeight === "0")
      ) {
        return true;
      }
      return acc;
    },
    false
  );
  const pluralBodyWeightExercises =
    state.templates.filter((t) => t.isBodyWeight).length > 1;

  if (loading) {
    return (
      <Center h="100%" w="100%">
        <LoadingSpinner />
      </Center>
    );
  }

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
          icon={<FaTimes />}
          onClick={toggleEditMode}
          variant="secondary"
          size="sm"
          px={0}
          mx={0}
          justifySelf="end"
        />
      </Grid>

      {/* USER VALUES */}
      <HStack w={["96%", "90%"]}>
        <BodyWeightSettings
          state={state}
          isInvalid={
            submitted &&
            [
              SettingErrors.bodyWeight,
              SettingErrors.bodyWeightRequiredWithUnit,
            ].some((e) => errors.includes(e))
          }
          handleStateChange={handleStateChange}
        />
        <BodyWeightUnitSettings
          state={state}
          isInvalid={
            submitted &&
            [
              SettingErrors.bodyWeightUnit,
              SettingErrors.unitRequiredWithWeight,
            ].some((e) => errors.includes(e))
          }
          handleStateChange={handleStateChange}
        />
      </HStack>

      {/* BODY WEIGHT ERROR MESSAGES */}
      <Box w={["96%", "90%"]}>
        {errors.map((error) => {
          if (!submitted) {
            return null;
          }
          return (
            <Text key={error} color={theme.colors.error} fontSize="xs">
              {error}
            </Text>
          );
        })}
      </Box>

      <Box w={["96%", "90%"]} m={2} color="gray.700">
        <Box
          borderBottom={`2px solid ${theme.colors.green[100]}`}
          mt={6}
          mb={4}
          fontWeight="bold"
        >
          <Text fontSize={["md", "lg", "xl"]}>EXERCISE TEMPLATES</Text>
        </Box>

        {/* TEMPLATES */}
        <AnimatePresence>
          {state.templates.map((template, index) => {
            return (
              <motion.div
                key={`${template.key}`}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <EditTemplate
                  template={template}
                  submitted={submitted}
                  templateTitles={state.templates.map((t) => t.title)}
                  templateIndex={index}
                  numTemplates={state.templates.length}
                  deleteTemplate={deleteTemplate}
                  moveTemplateIndex={moveTemplateIndex}
                  handleTemplate={handleTemplate}
                  setFormHasErrors={setFormHasErrors}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {serverError && showServerError && (
          <Alert
            status="error"
            my="1rem"
            borderRadius={"8px"}
            justifyContent={"space-between"}
          >
            <HStack>
              <AlertIcon />
              <AlertDescription>{serverError?.message}</AlertDescription>
            </HStack>
            <CloseButton
              alignSelf="flex-start"
              onClick={() => setShowServerError(false)}
            />
          </Alert>
        )}

        {/* ADD TEMPLATE & SAVE SETTINGS BUTTONS */}
        <HStack w="100%" justifyContent="space-between">
          <Button
            size={["sm", "md"]}
            variant="secondary"
            leftIcon={<FaSave />}
            onClick={onOpenSaveSettings}
            maxWidth="200px"
            w="100%"
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            Update Settings
          </Button>
          <Button
            size={["sm", "md"]}
            variant="primary"
            onClick={handleAddTemplate}
            leftIcon={<FaPlusCircle />}
            maxWidth="200px"
            w="100%"
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            Add Template
          </Button>
        </HStack>
      </Box>

      {/* SAVE SETTINGS MODAL */}
      <ConfirmModal
        isOpen={isOpenSaveSettings}
        onClose={onCloseSaveSettings}
        onConfirmation={onSaveSettings}
        ModalTitle="Update Settings"
        ModalBodyText={
          <>
            <Text mb="1rem">
              Are you sure your settings are finalized, and ready to be saved?
              This will overwrite your existing settings.
            </Text>
            <Text>
              Existing workouts will remain unchanged. Your new settings will
              only impact future workouts.
            </Text>
            {bodyWeightExercisesWithoutUserWeight && (
              <Alert status="warning" mt="1rem" borderRadius={"8px"}>
                <AlertIcon />
                <AlertDescription>
                  <Text mb="1rem">
                    {`${pluralBodyWeightExercises ? "" : "A"} Body Weight  ${
                      pluralBodyWeightExercises
                        ? "templates were"
                        : "template was"
                    } added without a Body Weight.
                  `}
                  </Text>

                  <Text>
                    {`KettlePal will not be able to calculate work capacity for ${
                      pluralBodyWeightExercises
                        ? "these exercises"
                        : "this exercise"
                    }. Was this a mistake?`}{" "}
                  </Text>
                </AlertDescription>
              </Alert>
            )}
          </>
        }
        CloseText="Cancel"
        ProceedText="Update"
        variant="confirm"
      />
    </VStack>
  );
}
