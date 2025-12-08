import React from "react";
import { EditSettingsState } from "../../Hooks/useEditSettings";
import TemplateContainer from "../NewWorkouts/FormComponents/Settings/Templates/TemplateContainer";
import useEditTemplate from "../../Hooks/useEditTemplate";
import ConfirmModal from "../ConfirmModal";

interface CreateTemplateProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  numTemplates: number;
  deleteTemplate: (index: number) => void;
  moveTemplateIndex: (templateIndex: number, direction: "up" | "down") => void;
}

export default function EditTemplate({
  template,
  templateIndex,
  numTemplates,
  deleteTemplate,
  moveTemplateIndex,
}: CreateTemplateProps) {
  const {
    errors,
    offset,
    minSwipeDistance,
    onDeleteTemplate,
    isOpenDeleteTemplate,
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
      minSwipeDistance={minSwipeDistance}
      templateIndex={templateIndex}
      numTemplates={numTemplates}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      swipeDistance={swipeDistance}
      onOpenDeleteTemplate={onOpenDeleteTemplate}
      moveTemplateIndex={moveTemplateIndex}
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
