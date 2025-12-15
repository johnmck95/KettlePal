import React, { useRef, useState } from "react";
import { Box, Tooltip, useOutsideClick } from "@chakra-ui/react";
import { FaRegQuestionCircle } from "react-icons/fa";
import theme from "../../Constants/theme";

export default function ToolTip({ message }: { message: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  return (
    <Tooltip
      label={message}
      placement="top"
      isOpen={isOpen}
      borderRadius="5px"
      color={theme.colors.white}
      bg={theme.colors.olive[600]}
      m="0.5rem"
      p="0.5rem"
      boxShadow={`0px 2px 8px ${theme.colors.olive[900]}`}
    >
      <Box
        ref={ref}
        display="inline-flex"
        cursor="pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaRegQuestionCircle size="14px" color="gray" />
      </Box>
    </Tooltip>
  );
}
