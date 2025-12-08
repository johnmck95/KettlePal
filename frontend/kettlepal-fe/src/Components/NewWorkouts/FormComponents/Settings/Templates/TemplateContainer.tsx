import React from "react";
import {
  Box,
  IconButton,
  VStack,
  Text,
  useMediaQuery,
  HStack,
} from "@chakra-ui/react";
import { FaArrowDown, FaArrowUp, FaTimes } from "react-icons/fa";
import theme from "../../../../../Constants/theme";

interface CreateTemplateProps {
  children: React.ReactNode;
  errors: string[];
  submitted: boolean;
  offset: number;
  minSwipeDistance: number;
  onTouchStart: any;
  onTouchMove: any;
  onTouchEnd: any;
  templateIndex: number;
  numTemplates: number;
  onOpenDeleteTemplate: () => void;
  swipeDistance: () => number;
  moveTemplateIndex: (templateIndex: number, direction: "up" | "down") => void;
}

export default function TemplateContainer({
  children,
  errors,
  submitted,
  offset,
  templateIndex,
  numTemplates,
  minSwipeDistance,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onOpenDeleteTemplate,
  swipeDistance,
  moveTemplateIndex,
}: CreateTemplateProps) {
  const [isMobile] = useMediaQuery("(max-width: 420px)");

  return (
    <Box mb={["0.75rem", "1rem"]} position="relative">
      <HStack w="100%" h="100%">
        <VStack
          flex="0 0 auto"
          justifyContent="space-between"
          h="100%"
          borderRadius={"5px"}
          bg="white"
          boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
        >
          <IconButton
            variant="secondary"
            aria-label="Move template up"
            icon={<FaArrowUp />}
            size="lg"
            m={0}
            p={0}
            border="none"
            onClick={() => moveTemplateIndex(templateIndex, "up")}
            isDisabled={templateIndex === 0}
          />
          <Text fontWeight={"bold"}> {templateIndex} </Text>
          <IconButton
            variant="secondary"
            aria-label="Move template down"
            icon={<FaArrowDown />}
            size="lg"
            border="none"
            onClick={() => moveTemplateIndex(templateIndex, "down")}
            isDisabled={templateIndex === numTemplates - 1}
          />
        </VStack>
        <VStack
          flex="1"
          w={`calc(100%-0.5rem + ${swipeDistance()})`}
          borderRadius={"5px"}
          bg="white"
          boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
          p={["0.35rem", "1rem", "1.5rem"]}
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
          h="100%"
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
      </HStack>
    </Box>
  );
}
