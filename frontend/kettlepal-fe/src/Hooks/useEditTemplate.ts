import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EditSettingsState } from "./useEditSettings";
import {
  RepsDisplayOptions,
  WeightOptions,
} from "../Constants/ExercisesOptions";

export enum TemplateErrors {
  title = "Title is required.",
  titleNotUnique = "Each title must be unique, case insensitive.",
  repsDisplay = "Type must be one of the options from the drop down.",
  weightUnit = "Weight Unit option is invalid.",
  multiplier = "Multiplier must be a realistic, positive number.",
  resistance = "Resistance type is invalid.",
  noUnitWhenBodyWeight = "Unit must be blank for Body Weight Exercises. KettlePal will automatically use your Body Weight.",
}

interface UseEditSettingsProps {
  template: EditSettingsState["templates"][0];
  templateTitles: string[];
  templateIndex: number;
  deleteTemplate: (index: number) => void;
  setFormHasErrors: (value: boolean) => void;
}

const useEditSettings = ({
  template,
  templateTitles,
  templateIndex,
  deleteTemplate,
  setFormHasErrors,
}: UseEditSettingsProps) => {
  // Removes template from state and handles swipe logic for mobile
  function onDeleteTemplate(): void {
    deleteTemplate(templateIndex);
    onCloseDeleteTemplate();
    setOffset(
      parseInt(
        `${
          !!swipeDistance() && swipeDistance() > minSwipeDistance
            ? swipeDistance()
            : offset
        }px`
      )
    );
  }

  // ERROR VALIDATION
  const titleIsInvalid = template.title.trim() === "";
  const nonUniqueTitleIsInvalid =
    templateTitles.filter(
      (title) => title.toLowerCase() === template.title.toLowerCase()
    ).length > 1;
  const repsDisplayIsInvalid =
    !RepsDisplayOptions.map((option) => option.value).includes(
      template.repsDisplay
    ) && template.repsDisplay !== "";
  const weightUnitIsInvalid =
    !WeightOptions.map((option) => option.value).includes(
      template.weightUnit
    ) && template.weightUnit !== "";
  const multiplierIsInvalid =
    Number.isNaN(Number(template.multiplier)) ||
    Number(template.multiplier) < 0 ||
    Number(template.multiplier) > 100;
  const resistanceIsInvalid = typeof template.isBodyWeight !== "boolean";
  const unitWithBodyWeightIsInvalid =
    template.isBodyWeight && template.weightUnit !== "";

  const [numErrors, setNumErrors] = useState(0);
  const errors: string[] = [];
  if (titleIsInvalid) errors.push(TemplateErrors.title);
  if (nonUniqueTitleIsInvalid) errors.push(TemplateErrors.titleNotUnique);
  if (repsDisplayIsInvalid) errors.push(TemplateErrors.repsDisplay);
  if (weightUnitIsInvalid) errors.push(TemplateErrors.weightUnit);
  if (multiplierIsInvalid) errors.push(TemplateErrors.multiplier);
  if (resistanceIsInvalid) errors.push(TemplateErrors.resistance);
  if (unitWithBodyWeightIsInvalid)
    errors.push(TemplateErrors.noUnitWhenBodyWeight);

  if (numErrors !== errors.length) {
    setNumErrors(errors.length);
  }
  // Flag to detect if the form has errors.
  useEffect(
    () => setFormHasErrors(numErrors > 0),
    [numErrors, setFormHasErrors]
  );

  // Swipe Logic
  const [offset, setOffset] = useState<number>(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const swipeDistance = () => {
    if (!touchStart || !touchEnd) {
      return 0;
    }
    return touchStart - touchEnd;
  };
  const onTouchStart = (e: any) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    const distance = swipeDistance();
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) {
      onOpenDeleteTemplate();
      setOffset(distance);
    }
  };
  const customOnCloseDeleteTemplate = () => {
    setOffset(0);
    onCloseDeleteTemplate();
  };

  // Delete Template Modal Controls
  const {
    isOpen: isOpenDeleteTemplate,
    onOpen: onOpenDeleteTemplate,
    onClose: onCloseDeleteTemplate,
  } = useDisclosure();

  return {
    offset,
    touchStart,
    touchEnd,
    minSwipeDistance,
    isOpenDeleteTemplate,
    errors,
    setOffset,
    swipeDistance,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onOpenDeleteTemplate,
    customOnCloseDeleteTemplate,
    onDeleteTemplate,
  };
};
export default useEditSettings;
