import React, { useState } from "react";
import EditSettings from "../Components/Settings/EditSettings";
import ViewSettings from "../Components/Settings/ViewSettings";

export type SettingsState = {
  edit: boolean;
};
export default function Settings() {
  const [state, setState] = useState<SettingsState>({ edit: false });
  return state.edit ? (
    <EditSettings state={state} handleState={setState} />
  ) : (
    <ViewSettings handleState={setState} />
  );
}
