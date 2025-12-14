import React, { ChangeEvent, useState } from "react";
import { useUser } from "../Contexts/UserContext";
import { useDisclosure } from "@chakra-ui/react";
import { useAddOrUpdateSettingsMutation } from "../generated/frontend-types";
import {
  RepsDisplayOptions,
  WeightOptions,
} from "../Constants/ExercisesOptions";

const EDIT_SETTINGS_STATE_KEY = "editSettingsState";

export type TemplateEditableField = Exclude<
  keyof EditSettingsState["templates"][number],
  "key"
>;

export type EditSettingsState = {
  bodyWeight: { value: string; errors: string[] };
  bodyWeightUnit: { value: string; errors: string[] };
  templates: Array<{
    title: { value: string; errors: string[] };
    repsDisplay: { value: string; errors: string[] };
    weightUnit: { value: string; errors: string[] };
    multiplier: { value: string; errors: string[] };
    isBodyWeight: { value: boolean; errors: string[] };
    index: { value: number; errors: string[] };
    key: string;
  }>;
};

export enum SettingErrors {
  bodyWeight = "Body Weight must be a realistic, positive number. If you prefer not to set a body weight, leave the field blank.",
  bodyWeightUnit = "Unit must be 'lb' or 'kg'. If you prefer not to set a body weight unit, leave the field blank.",
  unitRequiredWithWeight = "Unit is required when a Body Weight is specified.",
}
export enum TemplateErrors {
  title = "Title is required.",
  titleNotUnique = "Each title must be unique, case insensitive.",
  repsDisplay = "Type must be one of the options from the drop down.",
  weightUnit = "Weight Unit option is invalid.",
  multiplier = "Multiplier must be a realistic, positive number.",
  resistance = "Resistance type is invalid.",
  bodyWeightExerciseUnit = "Body Weight Exercises must use the user's Body Weight Unit.",
}

interface UseEditSettingsProps {
  setShowUploadSuccess: (show: boolean) => void;
  toggleEditMode: () => void;
}

const useEditSettings = ({
  setShowUploadSuccess,
  toggleEditMode,
}: UseEditSettingsProps) => {
  const { user, refetch: refetchUser } = useUser();
  // Initlialize state from session storage (if exists) or user context
  const [state, setState] = useState<EditSettingsState>(() => {
    const fromStorage = sessionStorage.getItem(EDIT_SETTINGS_STATE_KEY);
    return fromStorage
      ? JSON.parse(fromStorage)
      : {
          bodyWeight: {
            value: user?.bodyWeight ? user.bodyWeight.toString() : "",
            errors: [],
          },
          bodyWeightUnit: { value: user?.bodyWeightUnit ?? "kg", errors: [] },
          templates:
            user?.templates.map((template) => {
              return {
                title: { value: template.title, errors: [] },
                repsDisplay: {
                  value: template.repsDisplay ?? "",
                  errors: [],
                },
                weightUnit: {
                  value: template.weightUnit ?? user.bodyWeightUnit,
                  errors: [],
                },
                multiplier: { value: template.multiplier, errors: [] },
                isBodyWeight: { value: template.isBodyWeight, errors: [] },
                index: { value: template.index, errors: [] },
                key: `key-${Date.now()}-${Math.random().toString(36)}`,
              };
            }) ?? [],
        };
  });
  const [submitted, setSubmitted] = useState(false);
  const [showServerError, setShowServerError] = useState(true);

  const formHasErrors = () =>
    state.bodyWeight.errors.length > 0 ||
    state.bodyWeightUnit.errors.length > 0 ||
    state.templates.some((t) =>
      [
        t.title,
        t.repsDisplay,
        t.weightUnit,
        t.multiplier,
        t.isBodyWeight,
        t.index,
      ].some((f) => f.errors.length > 0)
    );

  // GQL Mutation
  const [addOrUpdateSettings, { loading, error: serverError }] =
    useAddOrUpdateSettingsMutation({
      onCompleted() {
        sessionStorage.removeItem(EDIT_SETTINGS_STATE_KEY);
        setShowUploadSuccess(true);
        setTimeout(() => {
          setShowUploadSuccess(false);
        }, 8000);
        setSubmitted(false);
        refetchUser();
        toggleEditMode();
      },
      onError() {
        setShowServerError(true);
      },
    });

  // Show client-side errors, if no-errors, try to post to DB
  async function onSaveSettings(): Promise<void> {
    setSubmitted(true);
    onCloseSaveSettings();
    if (formHasErrors()) {
      return;
    }

    try {
      addOrUpdateSettings({
        variables: {
          userUid: user?.uid ?? "",
          settings: {
            bodyWeight:
              state.bodyWeight.value === ""
                ? null
                : parseFloat(parseFloat(state.bodyWeight.value).toFixed(2)),
            bodyWeightUnit:
              state.bodyWeightUnit.value === ""
                ? null
                : state.bodyWeightUnit.value,
            templates: state.templates.map((template) => ({
              title: template.title.value,
              repsDisplay:
                template.repsDisplay.value === ""
                  ? null
                  : template.repsDisplay.value,
              weightUnit:
                template.weightUnit.value === "" || template.isBodyWeight.value
                  ? null
                  : template.weightUnit.value,
              multiplier: parseFloat(
                parseFloat(template.multiplier.value).toFixed(2)
              ),
              isBodyWeight: template.isBodyWeight.value,
              index: template.index.value,
            })),
          },
        },
      });
    } catch (error) {
      console.error("Error updating settings: ", error);
    }
  }
  type TemplateErrors = {
    title: string[];
    repsDisplay: string[];
    weightUnit: string[];
    multiplier: string[];
    isBodyWeight: string[];
  };
  type ValidationResult = {
    root: {
      bodyWeight: string[];
      bodyWeightUnit: string[];
    };
    templates: TemplateErrors[];
  };

  function validateState(state: EditSettingsState): ValidationResult {
    const result: ValidationResult = {
      root: {
        bodyWeight: [],
        bodyWeightUnit: [],
      },
      templates: state.templates.map(() => ({
        title: [],
        repsDisplay: [],
        weightUnit: [],
        multiplier: [],
        isBodyWeight: [],
      })),
    };

    // User-level validations
    if (
      Number.isNaN(Number(state.bodyWeight.value)) ||
      Number(state.bodyWeight.value) < 0 ||
      Number(state.bodyWeight.value) > 1400
    ) {
      result.root.bodyWeight.push(SettingErrors.bodyWeight);
    }
    if (!["lb", "kg"].includes(state.bodyWeightUnit.value)) {
      result.root.bodyWeightUnit.push(SettingErrors.bodyWeightUnit);
    }
    if (state.bodyWeight.value !== "" && state.bodyWeightUnit.value === "") {
      result.root.bodyWeightUnit.push(SettingErrors.unitRequiredWithWeight);
    }

    // Template-level validations
    state.templates.forEach((t, i) => {
      if (t.title.value.trim() === "") {
        result.templates[i].title.push(TemplateErrors.title);
      }
      if (
        state.templates
          .map((t) => t.title.value)
          .filter(
            (title) => title.toLowerCase() === t.title.value.toLowerCase()
          ).length > 1
      ) {
        result.templates[i].title.push(TemplateErrors.titleNotUnique);
      }
      if (
        !RepsDisplayOptions.map((option) => option.value).includes(
          t.repsDisplay.value
        ) &&
        t.repsDisplay.value !== ""
      ) {
        result.templates[i].repsDisplay.push(TemplateErrors.repsDisplay);
      }
      if (
        !WeightOptions.map((option) => option.value).includes(
          t.weightUnit.value
        ) &&
        t.weightUnit.value !== ""
      ) {
        result.templates[i].weightUnit.push(TemplateErrors.weightUnit);
      }
      if (
        Number.isNaN(Number(t.multiplier.value)) ||
        Number(t.multiplier.value) < 0 ||
        Number(t.multiplier.value) > 100
      ) {
        result.templates[i].multiplier.push(TemplateErrors.multiplier);
      }
      if (typeof t.isBodyWeight.value !== "boolean") {
        result.templates[i].isBodyWeight.push(TemplateErrors.resistance);
      }
      if (
        t.isBodyWeight.value &&
        t.weightUnit.value !== state.bodyWeightUnit.value
      ) {
        result.templates[i].weightUnit.push(
          TemplateErrors.bodyWeightExerciseUnit
        );
      }
    });

    return result;
  }

  function updateState(
    producer: (prev: EditSettingsState) => EditSettingsState
  ) {
    setState((prev) => {
      const next = producer(prev);
      const validation = validateState(next);

      return {
        ...next,
        bodyWeight: {
          ...next.bodyWeight,
          errors: validation.root.bodyWeight,
        },
        bodyWeightUnit: {
          ...next.bodyWeightUnit,
          errors: validation.root.bodyWeightUnit,
        },
        templates: next.templates.map((t, i) => ({
          ...t,
          title: {
            ...t.title,
            errors: validation.templates[i].title,
          },
          repsDisplay: {
            ...t.repsDisplay,
            errors: validation.templates[i].repsDisplay,
          },
          weightUnit: {
            ...t.weightUnit,
            errors: validation.templates[i].weightUnit,
          },
          multiplier: {
            ...t.multiplier,
            errors: validation.templates[i].multiplier,
          },
          isBodyWeight: {
            ...t.isBodyWeight,
            errors: validation.templates[i].isBodyWeight,
          },
        })),
      };
    });
  }

  // Adds a new template to state, with validation
  function handleAddTemplate() {
    updateState((prev) => ({
      ...prev,
      templates: [
        ...prev.templates,
        {
          title: { value: "", errors: [] },
          repsDisplay: { value: "", errors: [] },
          weightUnit: { value: "kg", errors: [] },
          multiplier: { value: "1.0", errors: [] },
          isBodyWeight: { value: false, errors: [] },
          index: { value: prev.templates.length, errors: [] },
          key: `key-${Date.now()}-${Math.random().toString(36)}`,
        },
      ],
    }));
  }

  // Deletes a template from state
  function deleteTemplate(index: number): void {
    updateState((prev) => ({
      ...prev,
      templates: prev?.templates
        ?.filter((_, i) => i !== index)
        .map((t, i) => ({ ...t, index: { value: i, errors: t.index.errors } })),
    }));
  }

  // Handles changes to template fields in state
  function handleTemplateStateChange(
    name: TemplateEditableField,
    value: string | number | boolean,
    index: number
  ): void {
    updateState((prev) => ({
      ...prev,
      templates: prev.templates.map((template, i) =>
        i === index
          ? {
              ...template,
              [name]: {
                ...template[name],
                value,
              },
            }
          : template
      ),
    }));
  }

  // Handles changes to user-level fields in state
  function handleUserStateChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const { name, value } = event.target;
    if (name !== "bodyWeight" && name !== "bodyWeightUnit") {
      return;
    }
    updateState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as "bodyWeight" | "bodyWeightUnit"],
        value,
      },
    }));
  }

  function moveTemplateIndex(templateIndex: number, direction: "up" | "down") {
    updateState((prev) => {
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
      const reindexed = templates.map((t, i) => ({
        ...t,
        index: { value: i, errors: t.index.errors },
      }));

      return { ...prev, templates: reindexed };
    });
  }

  // Sync edited state back to sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem(EDIT_SETTINGS_STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Save Settings Modal Controls
  const {
    isOpen: isOpenSaveSettings,
    onOpen: onOpenSaveSettings,
    onClose: onCloseSaveSettings,
  } = useDisclosure();

  return {
    state,
    user,
    loading,
    isOpenSaveSettings,
    serverError,
    showServerError,
    submitted,
    formHasErrors,
    onSaveSettings,
    setShowServerError,
    onCloseSaveSettings,
    onOpenSaveSettings,
    handleTemplate: handleTemplateStateChange,
    handleStateChange: handleUserStateChange,
    deleteTemplate,
    moveTemplateIndex,
    handleAddTemplate,
  };
};
export default useEditSettings;
