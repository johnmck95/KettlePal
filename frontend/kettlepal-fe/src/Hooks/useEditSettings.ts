import React, { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "../Contexts/UserContext";
import { useDisclosure } from "@chakra-ui/react";
import { useAddOrUpdateSettingsMutation } from "../generated/frontend-types";

const EDIT_SETTINGS_STATE_KEY = "editSettingsState";

export type EditSettingsState = {
  bodyWeight: string;
  bodyWeightUnit: string;
  templates: Array<{
    title: string;
    repsDisplay: string;
    weightUnit: string;
    multiplier: string;
    isBodyWeight: boolean;
    index: number;
    key: string;
  }>;
};

export enum SettingErrors {
  bodyWeight = "Body Weight must be a realistic, positive number. If you prefer not to set a body weight, leave the field blank.",
  bodyWeightUnit = "Unit must be 'lb' or 'kg'. If you prefer not to set a body weight unit, leave the field blank.",
  unitRequiredWithWeight = "Unit is required when a Body Weight is specified.",
  bodyWeightRequiredWithUnit = "Body Weight is required when a Unit is specified.",
}

const useEditSettings = () => {
  const { user, refetch: refetchUser } = useUser();
  // Initlialize state from session storage (if exists) or user context
  const [state, setState] = useState<EditSettingsState>(() => {
    const fromStorage = sessionStorage.getItem(EDIT_SETTINGS_STATE_KEY);
    return fromStorage
      ? JSON.parse(fromStorage)
      : {
          bodyWeight: user?.bodyWeight ? user.bodyWeight.toString() : "",
          bodyWeightUnit: user?.bodyWeightUnit ?? "lb",
          templates:
            user?.templates.map((template) => {
              return {
                title: template.title,
                repsDisplay: template.repsDisplay ?? "",
                weightUnit: template.weightUnit ?? "",
                multiplier: template.multiplier,
                isBodyWeight: template.isBodyWeight,
                index: template.index,
                key: `key-${Date.now()}-${Math.random().toString(36)}`,
              };
            }) ?? [],
        };
  });
  const [submitted, setSubmitted] = useState(false);
  const [numErrors, setNumErrors] = useState(0);
  const [formHasErrors, setFormHasErrors] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showServerError, setShowServerError] = useState(true);

  // Initialize a new template and add to state
  function handleAddTemplate() {
    setState((prevState) => ({
      ...prevState,
      templates: [
        ...prevState.templates,
        {
          title: "",
          repsDisplay: "",
          weightUnit: "",
          multiplier: "1.0",
          isBodyWeight: false,
          index: prevState.templates.length,
          key: `key-${Date.now()}-${Math.random().toString(36)}`,
        },
      ],
    }));
  }

  // User-Settings Validation (Template Validation is handled in child component)
  const errors: string[] = [];
  const bodyWeightIsInvalid =
    Number.isNaN(Number(state.bodyWeight)) ||
    Number(state.bodyWeight) < 0 ||
    Number(state.bodyWeight) > 1400;
  const bodyWeightUnitIsInvalid = !["lb", "kg", ""].includes(
    state.bodyWeightUnit
  );
  const bodyWeightNoUnitIsInvalid =
    state.bodyWeight !== "" && state.bodyWeightUnit === "";
  const unitNoBodyWeightIsInvalid =
    state.bodyWeight === "" && state.bodyWeightUnit !== "";
  if (bodyWeightIsInvalid) errors.push(SettingErrors.bodyWeight);
  if (bodyWeightUnitIsInvalid) errors.push(SettingErrors.bodyWeightUnit);
  if (bodyWeightNoUnitIsInvalid)
    errors.push(SettingErrors.unitRequiredWithWeight);
  if (unitNoBodyWeightIsInvalid)
    errors.push(SettingErrors.bodyWeightRequiredWithUnit);
  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }

  // Client-side error handling
  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  const [addOrUpdateSettings, { loading, error: serverError }] =
    useAddOrUpdateSettingsMutation({
      onCompleted() {
        sessionStorage.removeItem(EDIT_SETTINGS_STATE_KEY);
        setShowUploadSuccess(true);
        setTimeout(() => {
          setShowUploadSuccess(false);
        }, 5000);
        setSubmitted(false);
        refetchUser();
        // TODO: go back to the ViewSettings component
      },
      onError() {
        setShowServerError(true);
      },
    });

  // Show client-side errors, if clear, try to post to DB
  // apollo onError will handle rendering server-side errors
  async function onSaveSettings(): Promise<void> {
    setSubmitted(true);
    onCloseSaveSettings();
    if (
      bodyWeightIsInvalid ||
      bodyWeightUnitIsInvalid ||
      bodyWeightNoUnitIsInvalid ||
      unitNoBodyWeightIsInvalid
    ) {
      setFormHasErrors(true);
      return;
    }
    if (formHasErrors) {
      return;
    }
    try {
      addOrUpdateSettings({
        variables: {
          userUid: user?.uid ?? "",
          settings: {
            bodyWeight:
              state.bodyWeight === ""
                ? null
                : parseFloat(parseFloat(state.bodyWeight).toFixed(2)),
            bodyWeightUnit:
              state.bodyWeightUnit === "" ? null : state.bodyWeightUnit,
            templates: state.templates.map((template) => ({
              title: template.title,
              repsDisplay:
                template.repsDisplay === "" ? null : template.repsDisplay,
              weightUnit:
                template.weightUnit === "" ? null : template.weightUnit,
              multiplier: parseFloat(
                parseFloat(template.multiplier).toFixed(2)
              ),
              isBodyWeight: template.isBodyWeight,
              index: template.index,
            })),
          },
        },
      });
    } catch (error) {
      console.error("Error updating settings: ", error);
    }
  }

  // Deletes a template from state
  function deleteTemplate(index: number): void {
    setState((prevState) => ({
      ...prevState,
      templates: prevState?.templates
        ?.filter((_, i) => i !== index)
        .map((t, i) => ({ ...t, index: i })),
    }));
  }

  // Updates all per-template state properties based on the index.
  function handleTemplate(
    name: string,
    value: string | number | boolean,
    index: number
  ): void {
    setState((prevState) => ({
      ...prevState,
      templates: prevState.templates.map((template, i) => {
        if (i === index) {
          return {
            ...template,
            [name]: value,
          };
        }
        return template;
      }),
    }));
  }

  function moveTemplateIndex(templateIndex: number, direction: "up" | "down") {
    setState((prev) => {
      const templates = [...prev.templates];
      const targetIndex =
        direction === "up"
          ? templateIndex - 1
          : direction === "down"
          ? templateIndex + 1
          : templateIndex;
      if (targetIndex < 0 || targetIndex >= templates.length) {
        return prev;
      }

      // swap templates & re-index
      const temp = templates[templateIndex];
      templates[templateIndex] = templates[targetIndex];
      templates[targetIndex] = temp;
      const reindexed = templates.map((t, i) => ({ ...t, index: i }));

      return { ...prev, templates: reindexed };
    });
  }

  // Sync edited state back to sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem(EDIT_SETTINGS_STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Generic Template state setter function
  function handleStateChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  // Save Settings Modal Controls
  const {
    isOpen: isOpenSaveSettings,
    onOpen: onOpenSaveSettings,
    onClose: onCloseSaveSettings,
  } = useDisclosure();

  return {
    state,
    user,
    isOpenSaveSettings,
    serverError,
    errors,
    showServerError,
    submitted,
    showUploadSuccess,
    onSaveSettings,
    setShowServerError,
    onCloseSaveSettings,
    onOpenSaveSettings,
    handleTemplate,
    handleStateChange,
    deleteTemplate,
    moveTemplateIndex,
    handleAddTemplate,
    setFormHasErrors,
  };
};

export default useEditSettings;
