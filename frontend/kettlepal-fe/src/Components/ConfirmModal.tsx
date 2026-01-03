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
  ModalBodyText: string | JSX.Element;
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
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent margin={"1rem"}>
          <ModalHeader color={theme.colors.olive[900]}>
            {ModalTitle}
          </ModalHeader>
          <ModalCloseButton
            sx={{
              color: "black",
              border: "none",
              _hover: {
                bg: "grey.50",
                boxShadow: `0px 1px 2px #E2E8F0 !important`,
              },
              _active: {
                bg: "grey.100",
                boxShadow: `0px 2px 4px #CBD5E0 !important`,
              },
            }}
          />
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
              <Button onClick={onClose} width="100px" variant="secondary">
                {CloseText}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
