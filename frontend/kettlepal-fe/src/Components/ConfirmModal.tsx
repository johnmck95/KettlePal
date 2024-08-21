import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import theme from "../Constants/theme";

import React from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  ModalTitle,
  ModalBodyText,
  CloseText,
  ProceedText,
  onConfirmation,
  variant,
}: {
  isOpen: boolean;
  onClose: () => void;
  ModalTitle: string;
  ModalBodyText: string;
  CloseText: string;
  ProceedText: string;
  onConfirmation: () => void;
  variant: "warn" | "confirm";
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent margin={"1rem"}>
          <ModalHeader color={theme.colors.olive[900]}>
            {ModalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>{ModalBodyText}</Box>
          </ModalBody>

          <ModalFooter>
            <Flex w="100%" justifyContent="space-around">
              <Button
                onClick={onConfirmation}
                width="100px"
                variant={variant === "confirm" ? "primary" : "warn"}
              >
                {ProceedText}
              </Button>
              <Button
                onClick={onClose}
                width="100px"
                variant="outline"
                colorScheme="grey"
              >
                {CloseText}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
