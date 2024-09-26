import { Box, IconButton, Text, VStack, useMediaQuery } from "@chakra-ui/react";
import theme from "../../../../Constants/theme";
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
  swipeDistance,
  onOpenDeleteExercise,
}: ExerciseContainerProps) {
  const [isMobile] = useMediaQuery("(max-width: 420px)");

  return (
    <Box mb="1rem" position="relative">
      <VStack
        w={`calc(100%-0.5rem + ${swipeDistance()})`}
        borderRadius={"5px"}
        p={["0.5rem", "1rem", "1.5rem"]}
        mb="0.5rem"
        boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
        bg="white"
        position="relative"
        transition="right 0.4s ease-in-out"
        right={`${
          !!swipeDistance() && swipeDistance() > minSwipeDistance
            ? swipeDistance()
            : offset
        }px`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!isMobile && (
          <IconButton
            variant="closeX"
            aria-label="Delete Exercise"
            icon={<FaTimes />}
            size="sm"
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
          <Text key={error} color={theme.colors.error} fontSize="xs">
            {error}
          </Text>
        );
      })}
    </Box>
  );
}
