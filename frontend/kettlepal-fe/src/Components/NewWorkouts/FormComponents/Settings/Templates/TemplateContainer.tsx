import React from "react";
import { Box, IconButton, VStack, Text, useMediaQuery } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import theme from "../../../../../Constants/theme";
import ConfirmModal from "../../../../ConfirmModal";

interface CreateTemplateProps {
  children: React.ReactNode;
  errors: string[];
  submitted: boolean;
  offset: number;
  minSwipeDistance: number;
  onTouchStart: any;
  onTouchMove: any;
  onTouchEnd: any;
  setOffset: (offset: number) => void;
  onOpenDeleteTemplate: () => void;
  swipeDistance: () => number;
}

export default function TemplateContainer({
  children,
  errors,
  submitted,
  offset,
  minSwipeDistance,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onOpenDeleteTemplate,
  swipeDistance,
}: CreateTemplateProps) {
  const [isMobile] = useMediaQuery("(max-width: 420px)");

  return (
    <Box mb={["0.75rem", "1rem"]} position="relative">
      <VStack
        w={`calc(100%-0.5rem + ${swipeDistance()})`}
        borderRadius={"5px"}
        p={["0.35rem", "1rem", "1.5rem"]}
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
            onClick={onOpenDeleteTemplate}
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

      {/* DELETE Template MODAL */}
      <ConfirmModal
        isOpen={false}
        onClose={() => console.log("TODO")}
        onConfirmation={() => console.log("TODO")}
        ModalTitle="Delete Template"
        ModalBodyText="Are you sure you would like to delete this Exercise Template? This cannot be undone."
        CloseText="Cancel"
        ProceedText="Delete"
        variant="warn"
      />
    </Box>
  );
}
