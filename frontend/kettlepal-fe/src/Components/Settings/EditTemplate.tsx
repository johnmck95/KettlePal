import React from "react";
import { EditSettingsState } from "../../Hooks/useEditSettings";
import TemplateContainer from "../NewWorkouts/FormComponents/Settings/Templates/TemplateContainer";
import useEditTemplate, { TemplateErrors } from "../../Hooks/useEditTemplate";
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
  templateTitles: string[];
  deleteTemplate: (index: number) => void;
  moveTemplateIndex: (templateIndex: number, direction: "up" | "down") => void;
  handleTemplate: (
    name: string,
    value: string | number | boolean,
    index: number
  ) => void;
  setFormHasErrors: (value: boolean) => void;
}

export default function EditTemplate({
  template,
  templateTitles,
  templateIndex,
  numTemplates,
  submitted,
  deleteTemplate,
  moveTemplateIndex,
  handleTemplate,
  setFormHasErrors,
}: CreateTemplateProps) {
  const {
    errors,
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
    template,
    templateTitles,
    templateIndex,
    deleteTemplate,
    setFormHasErrors,
  });

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
              isInvalid={
                submitted &&
                [TemplateErrors.title, TemplateErrors.titleNotUnique].some(
                  (e) => errors.includes(e)
                )
              }
              handleTemplate={handleTemplate}
            />
          </GridItem>
          <GridItem>
            <TemplateRepsDisplay
              template={template}
              templateIndex={templateIndex}
              isInvalid={
                submitted &&
                [TemplateErrors.repsDisplay].some((e) => errors.includes(e))
              }
              handleTemplate={handleTemplate}
            />
          </GridItem>
        </Grid>

        {/* ROW 2:  UNIT / MULTIPLIER / RESISTANCE */}
        <Grid templateColumns={["0.6fr 0.6fr 1fr", "1fr 1fr 1fr"]} gap={[2, 4]}>
          <GridItem>
            <TemplatesWeightUnit
              template={template}
              templateIndex={templateIndex}
              isInvalid={
                submitted &&
                [
                  TemplateErrors.weightUnit,
                  TemplateErrors.noUnitWhenBodyWeight,
                ].some((e) => errors.includes(e))
              }
              handleTemplate={handleTemplate}
            />
          </GridItem>
          <GridItem>
            <TemplatesMultiplier
              template={template}
              templateIndex={templateIndex}
              isInvalid={
                submitted &&
                [TemplateErrors.multiplier].some((e) => errors.includes(e))
              }
              handleTemplate={handleTemplate}
            />
          </GridItem>
          <GridItem>
            <TemplatesResistance
              template={template}
              templateIndex={templateIndex}
              isInvalid={
                submitted &&
                [TemplateErrors.resistance].some((e) => errors.includes(e))
              }
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
        ModalTitle="Delete Template"
        ModalBodyText="Are you sure you would like to delete this Exercise Template? This cannot be undone."
        CloseText="Cancel"
        ProceedText="Delete"
        variant="warn"
      />
    </TemplateContainer>
  );
}
