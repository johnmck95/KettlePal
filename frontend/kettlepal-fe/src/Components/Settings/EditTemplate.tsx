import React from "react";
import {
  EditSettingsState,
  TemplateEditableField,
} from "../../Hooks/useEditSettings";
import TemplateContainer from "../NewWorkouts/FormComponents/Settings/Templates/TemplateContainer";
import useEditTemplate from "../../Hooks/useEditTemplate";
import ConfirmModal from "../ConfirmModal";
import { Grid, GridItem } from "@chakra-ui/react";
import TemplateTitle from "../NewWorkouts/FormComponents/Settings/Templates/TemplatesTitle";
import TemplateRepsDisplay from "../NewWorkouts/FormComponents/Settings/Templates/TemplatesRepsDisplay";
import TemplatesWeightUnit from "../NewWorkouts/FormComponents/Settings/Templates/TemplatesWeightUnit";
import TemplatesMultiplier from "../NewWorkouts/FormComponents/Settings/Templates/TemplatesMultiplier";
import TemplatesResistance from "../NewWorkouts/FormComponents/Settings/Templates/TemplatesResistance";

interface CreateTemplateProps {
  template: EditSettingsState["templates"][0];
  templateIndex: number;
  numTemplates: number;
  submitted: boolean;
  bodyWeightUnit: "kg" | "lb";
  deleteTemplate: (index: number) => void;
  moveTemplateIndex: (templateIndex: number, direction: "up" | "down") => void;
  handleTemplate: (
    name: TemplateEditableField,
    value: string | number | boolean,
    index: number
  ) => void;
}

export default function EditTemplate({
  template,
  templateIndex,
  numTemplates,
  submitted,
  bodyWeightUnit,
  deleteTemplate,
  moveTemplateIndex,
  handleTemplate,
}: CreateTemplateProps) {
  const {
    offset,
    minSwipeDistance,
    isOpenDeleteTemplate,
    onDeleteTemplate,
    onTouchStart,
    customOnCloseDeleteTemplate,
    onTouchMove,
    onTouchEnd,
    swipeDistance,
    onOpenDeleteTemplate,
  } = useEditTemplate({
    templateIndex,
    deleteTemplate,
  });

  const errors = [
    ...template.title.errors,
    ...template.repsDisplay.errors,
    ...template.weightUnit.errors,
    ...template.multiplier.errors,
    ...template.isBodyWeight.errors,
    ...template.index.errors,
  ];

  return (
    <TemplateContainer
      errors={errors}
      submitted={submitted}
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
      <Grid templateRows="auto auto" w="100%" h="100%" gap={[2, 4]}>
        {/* ROW 1:  TITLE / TYPE */}
        <Grid templateColumns="1fr 1fr" gap={[2, 4]}>
          <GridItem>
            <TemplateTitle
              template={template}
              templateIndex={templateIndex}
              isInvalid={submitted && template.title.errors.length > 0}
              handleTemplate={handleTemplate}
            />
          </GridItem>
          <GridItem>
            <TemplateRepsDisplay
              template={template}
              templateIndex={templateIndex}
              isInvalid={submitted && template.repsDisplay.errors.length > 0}
              handleTemplate={handleTemplate}
            />
          </GridItem>
        </Grid>

        {/* ROW 2:  UNIT / MULTIPLIER / RESISTANCE */}
        <Grid templateColumns={["0.6fr 0.6fr 1fr", "1fr 1fr 1fr"]} gap={[2, 4]}>
          <GridItem>
            <TemplatesWeightUnit
              template={template}
              isBodyWeight={template.isBodyWeight.value}
              templateIndex={templateIndex}
              isInvalid={submitted && template.weightUnit.errors.length > 0}
              handleTemplate={handleTemplate}
            />
          </GridItem>
          <GridItem>
            <TemplatesMultiplier
              template={template}
              templateIndex={templateIndex}
              isInvalid={submitted && template.multiplier.errors.length > 0}
              handleTemplate={handleTemplate}
            />
          </GridItem>
          <GridItem>
            <TemplatesResistance
              template={template}
              bodyWeightUnit={bodyWeightUnit}
              templateIndex={templateIndex}
              isInvalid={template.isBodyWeight.errors.length > 0}
              handleTemplate={handleTemplate}
            />
          </GridItem>
        </Grid>
      </Grid>

      {/* DELETE EXERCISE MODAL */}
      <ConfirmModal
        isOpen={isOpenDeleteTemplate}
        onClose={customOnCloseDeleteTemplate}
        onConfirmation={onDeleteTemplate}
        ModalTitle="Delete Template?"
        ModalBodyText="Are you sure you would like to delete this Exercise Template?"
        CloseText="Cancel"
        ProceedText="Delete"
        variant="warn"
      />
    </TemplateContainer>
  );
}
