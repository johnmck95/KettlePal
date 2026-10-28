import { Box, IconButton, Text, VStack, useMediaQuery } from "@chakra-ui/react";
import theme from "../../../../../Constants/theme";
import { FaTimes } from "react-icons/fa";

interface ExerciseContainerProps {
  children: React.ReactNode;
  errors: string[];
  submitted: boolean;
  offset: number;
  minSwipeDistance: number;
  onTouchStart: any;
  onTouchMove: any;
  onTouchEnd: any;
  forceMobileStyle: boolean;
  forceCloseButton: boolean;
  flat?: boolean;
  stripColor?: string;
  setOffset: (offset: number) => void;
  onOpenDeleteExercise: () => void;
  swipeDistance: () => number;
}

export function ExerciseContainer({
  children,
  errors,
  submitted,
  offset,
  minSwipeDistance,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  forceMobileStyle,
  forceCloseButton,
  flat = false,
  stripColor,
  swipeDistance,
  onOpenDeleteExercise,
}: ExerciseContainerProps) {
  const [isMobile] = useMediaQuery("(max-width: 430px)");
  const renderAsMobile = forceMobileStyle === true || isMobile === true;

  return (
    <Box mb={errors.length > 0 ? "1rem" : "0rem"}>
      <VStack
        w={flat ? "100%" : `calc(100%-0.5rem + ${swipeDistance()})`}
        borderRadius={flat ? "0" : "5px"}
        p={flat ? "0.1rem" : "0.75rem"}
        mb={flat ? "0" : "0.5rem"}
        borderLeft={stripColor ? "4px solid" : "none"}
        borderColor={stripColor}
        boxShadow={flat ? "none" : `0px 1px 4px ${theme.colors.grey[400]}`}
        bg={flat ? "transparent" : "white"}
        minH={flat ? "1.75rem" : undefined}
        position="relative"
        transition="right 0.4s ease-in-out"
        right={
          forceCloseButton
            ? "none"
            : `${
                !!swipeDistance() && swipeDistance() > minSwipeDistance
                  ? swipeDistance()
                  : offset
              }px`
        }
        onTouchStart={forceCloseButton ? null : onTouchStart}
        onTouchMove={forceCloseButton ? null : onTouchMove}
        onTouchEnd={forceCloseButton ? null : onTouchEnd}
      >
        {(!renderAsMobile || forceCloseButton) && (
          <IconButton
            variant="closeX"
            aria-label="Delete Exercise"
            icon={<FaTimes />}
            size="xs"
            zIndex={2}
            onClick={onOpenDeleteExercise}
            position="absolute"
            right="1px"
            top="1px"
          />
        )}
        {children}
      </VStack>

      {/* ERROR MESSAGES */}
      {errors.map((error) => {
        if (!submitted) {
          return null;
        }
        return (
          <Text
            key={error}
            color={theme.colors.error}
            fontSize={renderAsMobile ? "xs" : "sm"}
          >
            • {error}
          </Text>
        );
      })}
    </Box>
  );
}
