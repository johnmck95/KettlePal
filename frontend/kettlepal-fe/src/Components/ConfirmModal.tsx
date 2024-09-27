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
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
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
