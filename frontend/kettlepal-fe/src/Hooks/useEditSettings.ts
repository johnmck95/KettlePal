import React, { ChangeEvent, useState } from "react";
import { useUser } from "../Contexts/UserContext";

const EDIT_SETTINGS_STATE_KEY = "editSettingsState";

export type EditSettingsState = {
  bodyWeight: string;
  bodyWeightUnit: string;
  templates: Array<{
    title: string;
    repsDisplay: string;
    weightUnit: string;
    multiplier: number;
    isBodyWeight: boolean;
    index: number;
    key: string;
  }>;
};

const useEditSettings = () => {
  const user = useUser().user;
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

  // Deletes a template from state
  function deleteTemplate(index: number): void {
    setState((prevState) => ({
      ...prevState,
      templates: prevState?.templates?.filter((_, i) => i !== index),
    }));
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

  return {
    state,
    user,
    handleStateChange,
    deleteTemplate,
  };
};

export default useEditSettings;
