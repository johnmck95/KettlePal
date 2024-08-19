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
}: {
  isOpen: boolean;
  onClose: () => void;
  ModalTitle: string;
  ModalBodyText: string;
  CloseText: string;
  ProceedText: string;
  onConfirmation: () => void;
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
          <ModalHeader>{ModalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>{ModalBodyText}</Box>
          </ModalBody>

          <ModalFooter>
            <Flex w="100%" justifyContent="space-around">
              <Button
                color={theme.colors.feldgrau[700]}
                onClick={onConfirmation}
              >
                {ProceedText}
              </Button>
              <Button color={theme.colors.bole[700]} onClick={onClose}>
                {CloseText}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
