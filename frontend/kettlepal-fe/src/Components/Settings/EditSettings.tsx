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
  List,
  ListIcon,
  ListItem,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import theme from "../../Constants/theme";
import {
  FaCheckCircle,
  FaFileImport,
  FaPlusCircle,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import BodyWeightSettings from "../NewWorkouts/FormComponents/Settings/User/BodyWeightSettings";
import BodyWeightUnitSettings from "../NewWorkouts/FormComponents/Settings/User/BodyWeightUnitSettings";
import { AnimatePresence, motion } from "framer-motion";
import useEditSettings from "../../Hooks/useEditSettings";
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
    submitted,
    isOpenLeaveSettings,
    isOpenImportDefault,
    isOpenDiscard,
    onOpenDiscard,
    onCloseDiscard,
    onOpenImportDefault,
    onCloseImportDefault,
    onOpenLeaveSettings,
    onCloseLeaveSettings,
    setShowServerError,
    onOpenSaveSettings,
    onSaveSettings,
    onCloseSaveSettings,
    handleTemplate,
    handleStateChange,
    deleteTemplate,
    moveTemplateIndex,
    handleAddTemplate,
    formHasErrors,
    importDefaultTemplates,
    discardChanges,
  } = useEditSettings({ setShowUploadSuccess, toggleEditMode });
  const [isMobile] = useMediaQuery("(max-width: 615px)");
  const bodyWeightExercisesWithoutUserWeight = state.templates.reduce(
    (acc, template) => {
      if (
        !acc &&
        template.isBodyWeight.value &&
        (state.bodyWeight.value === "" || state.bodyWeight.value === "0")
      ) {
        return true;
      }
      return acc;
    },
    false
  );
  const pluralBodyWeightExercises =
    state.templates.filter((t) => t.isBodyWeight.value).length > 1;

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
          onClick={onOpenLeaveSettings}
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
          isInvalid={submitted && state.bodyWeight.errors.length > 0}
          handleStateChange={handleStateChange}
        />
        <BodyWeightUnitSettings
          state={state}
          isInvalid={submitted && state.bodyWeightUnit.errors.length > 0}
          handleStateChange={handleStateChange}
          handleTemplate={handleTemplate}
        />
      </HStack>

      {/* BODY WEIGHT ERROR MESSAGES */}
      <Box w={["96%", "90%"]}>
        {[...state.bodyWeight.errors, ...state.bodyWeightUnit.errors].map(
          (error) => {
            if (!submitted) {
              return null;
            }
            return (
              <Text key={error} color={theme.colors.error} fontSize="xs">
                {error}
              </Text>
            );
          }
        )}
      </Box>

      <Box w={["96%", "90%"]} m={2} color="gray.700">
        <HStack
          borderBottom={`2px solid ${theme.colors.green[100]}`}
          fontWeight="bold"
          mb="1rem"
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <Text fontSize={["md", "lg", "xl"]}>EXERCISE TEMPLATES</Text>
          <Stack direction={isMobile ? "column" : "row"} spacing={1}>
            <Button
              size={["sm", "md"]}
              variant="link"
              leftIcon={<FaFileImport />}
              onClick={onOpenImportDefault}
              color={theme.colors.olive[200]}
              maxWidth="160px"
              sx={{
                justifyContent: "flex-start",
                "> span": {
                  justifyContent: "flex-start !important",
                },
                _focus: {
                  color: theme.colors.olive[600],
                },
              }}
            >
              Import Default
            </Button>
            <Button
              size={["sm", "md"]}
              variant="link"
              leftIcon={<FaTrash />}
              onClick={onOpenDiscard}
              w="160px"
              color={theme.colors.olive[200]}
              sx={{
                justifyContent: "flex-start",
                "> span": {
                  justifyContent: "flex-start !important",
                },
                _focus: {
                  color: theme.colors.olive[600],
                },
              }}
            >
              Discard Changes
            </Button>
          </Stack>
        </HStack>
        {state.templates.length <= 0 && (
          <Text
            my="2rem"
            mx="1rem"
            color={theme.colors.grey[600]}
            fontSize={["sm", "md"]}
            textAlign={"center"}
          >
            Click <b>Import Default</b> to help get started.
            <br />
            Click <b>Add Template</b> to define your own exercises.
            <br />
            <br />
            You can then adjust each exercise template to customize the
            KettlePal experience.
            <br />
            <br />
            Remember, once you save atleast one template, KettlePal will stop
            showing the default exercises and start showing your templates on
            the New Workout page.
          </Text>
        )}

        <AnimatePresence mode="popLayout">
          {state.templates.map((template, index) => (
            <motion.div
              key={template.key}
              layout
              layoutId={template.key}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{
                layout: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.2 },
              }}
            >
              <EditTemplate
                template={template}
                bodyWeightUnit={state.bodyWeightUnit.value as "kg" | "lb"}
                submitted={submitted}
                templateIndex={index}
                numTemplates={state.templates.length}
                deleteTemplate={deleteTemplate}
                moveTemplateIndex={moveTemplateIndex}
                handleTemplate={handleTemplate}
              />
            </motion.div>
          ))}
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
        {submitted && formHasErrors() && (
          <Text my="1rem" color={theme.colors.error} fontSize="xs">
            • Please fix the form errors before updating your settings.
          </Text>
        )}
      </Box>

      {/* IMPORT DEFAULT TEMPLATES */}
      <ConfirmModal
        isOpen={isOpenImportDefault}
        onClose={onCloseImportDefault}
        onConfirmation={importDefaultTemplates}
        ModalTitle="Import Default Templates"
        ModalBodyText={
          <Text mb="1rem">
            Click <b>Continue</b> to append the 13 standard KettlePal exercise
            templates.
            <br />
            <br />
            Once imported, you may modify or delete all templates as needed.
          </Text>
        }
        CloseText="Cancel"
        ProceedText="Continue"
        variant="confirm"
      />

      {/* DISCARD SETTING CHANGES */}
      <ConfirmModal
        isOpen={isOpenDiscard}
        onClose={onCloseDiscard}
        onConfirmation={discardChanges}
        ModalTitle="Discard Settings Changes?"
        ModalBodyText={
          <Text mb="1rem">
            Click <b>Continue</b> to discard all unsaved changes on the Settings
            page.
            <br />
            <br />
            Your current settings will stay exactly as they are. You can always
            edit them later.
          </Text>
        }
        CloseText="Cancel"
        ProceedText="Continue"
        variant="warn"
      />

      {/* EXIT TEMPLATE EDIT */}
      <ConfirmModal
        isOpen={isOpenLeaveSettings}
        onClose={onCloseLeaveSettings}
        onConfirmation={toggleEditMode}
        ModalTitle="Draft Saved"
        ModalBodyText={
          <Text mb="1rem">
            Your changes will be saved as long as you keep the application
            running. Are you sure you want to leave before updating your
            settings?
          </Text>
        }
        CloseText="Cancel"
        ProceedText="Continue"
        variant="confirm"
      ></ConfirmModal>

      {/* UPDATE SETTINGS MODAL */}
      <ConfirmModal
        isOpen={isOpenSaveSettings}
        onClose={onCloseSaveSettings}
        onConfirmation={onSaveSettings}
        ModalTitle="Update Settings"
        ModalBodyText={
          <>
            <Text mb="1rem" fontWeight="600">
              Are you sure your settings are finalized, and ready to be saved?
              This will:
            </Text>
            <List mx={1} spacing={2} fontSize={"sm"}>
              <ListItem>
                <HStack>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  <Text>Override your existing settings.</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  <Text>
                    Replace exercise options in the <b>New</b> page.
                  </Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  <Text>
                    Affect future workouts. Past workouts remain unchanged.
                  </Text>
                </HStack>
              </ListItem>
            </List>

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
