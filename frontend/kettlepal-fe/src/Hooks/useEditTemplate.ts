import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

interface UseEditSettingsProps {
  templateIndex: number;
  deleteTemplate: (index: number) => void;
}

const useEditSettings = ({
  templateIndex,
  deleteTemplate,
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
    errors: [],
    offset,
    touchStart,
    touchEnd,
    minSwipeDistance,
    isOpenDeleteTemplate,
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
