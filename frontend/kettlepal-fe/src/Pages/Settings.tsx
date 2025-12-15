import React, { useState } from "react";
import EditSettings from "../Components/Settings/EditSettings";
import ViewSettings from "../Components/Settings/ViewSettings";

export default function Settings() {
  const [editMode, setEditMode] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  return editMode ? (
    <EditSettings
      setShowUploadSuccess={setShowUploadSuccess}
      toggleEditMode={() => setEditMode((prev) => !prev)}
    />
  ) : (
    <ViewSettings
      showUploadSuccess={showUploadSuccess}
      toggleEditMode={() => setEditMode((prev) => !prev)}
    />
  );
}
