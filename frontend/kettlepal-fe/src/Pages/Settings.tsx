import React, { useState } from "react";
import EditSettings from "../Components/Settings/EditSettings";
import ViewSettings from "../Components/Settings/ViewSettings";

export default function Settings() {
  const [editMode, setEditMode] = useState(false);

  return editMode ? (
    <EditSettings toggleEditMode={() => setEditMode((prev) => !prev)} />
  ) : (
    <ViewSettings toggleEditMode={() => setEditMode((prev) => !prev)} />
  );
}
