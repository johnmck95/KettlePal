import React from "react";
import { EditSettingsState } from "../../Hooks/useEditSettings";
import TemplateContainer from "../NewWorkouts/FormComponents/Settings/Templates/TemplateContainer";
import useEditTemplate from "../../Hooks/useEditTemplate";
import ConfirmModal from "../ConfirmModal";

interface CreateTemplateProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  deleteTemplate: (index: number) => void;
}

export default function EditTemplate({
  template,
  templateIndex,
  deleteTemplate,
}: CreateTemplateProps) {
  const {
    errors,
    offset,
    minSwipeDistance,
    onDeleteTemplate,
    isOpenDeleteTemplate,
    setOffset,
    onTouchStart,
    customOnCloseDeleteTemplate,
    onTouchMove,
    onTouchEnd,
    swipeDistance,
    onOpenDeleteTemplate,
  } = useEditTemplate({ templateIndex, deleteTemplate });

  return (
    <TemplateContainer
      errors={errors}
      submitted={false}
      offset={offset}
      setOffset={setOffset}
      minSwipeDistance={minSwipeDistance}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      swipeDistance={swipeDistance}
      onOpenDeleteTemplate={onOpenDeleteTemplate}
    >
      <h1>{template.title}</h1>

      {/* DELETE EXERCISE MODAL */}
      <ConfirmModal
        isOpen={isOpenDeleteTemplate}
        onClose={customOnCloseDeleteTemplate}
        onConfirmation={onDeleteTemplate}
        ModalTitle="Delete Template"
        ModalBodyText="Are you sure you would like to delete this Exercise Template? This cannot be undone."
        CloseText="Cancel"
        ProceedText="Delete"
        variant="warn"
      />
    </TemplateContainer>
  );
}
