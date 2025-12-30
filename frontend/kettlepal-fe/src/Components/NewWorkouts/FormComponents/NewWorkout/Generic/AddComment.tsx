import React, { useRef, useCallback, useEffect } from "react";
import theme from "../../../../../Constants/theme";
import { Box, Textarea } from "@chakra-ui/react";

export default function AddComment({
  isInvalid,
  placeholderText,
  comment,
  setComment,
  maxWidth,
}: {
  isInvalid: boolean;
  placeholderText?: string;
  comment: string;
  setComment: (newComment: string) => void;
  maxWidth?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset to get accurate scrollHeight
      textarea.style.height = "0px";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, 32), 200);

      // vertical centering for single line, normal for multi-line
      textarea.style.lineHeight = newHeight === 32 ? "32px" : "1.25";
      textarea.style.height = newHeight + "px";
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    updateHeight();
  };

  useEffect(() => {
    updateHeight();
  }, [updateHeight, comment]);

  return (
    <Box
      w="100%"
      borderWidth={isInvalid ? "2px" : "1px"}
      borderColor={isInvalid ? theme.colors.red[500] : theme.colors.gray[300]}
      borderRadius="5px"
      px={isInvalid ? "0.375rem" : "0.5rem"}
      maxW={maxWidth}
      bg="white"
      fontSize="16px"
      minH="32px"
      maxH="200px"
      overflow="hidden"
      py="0.25rem"
    >
      <Textarea
        ref={textareaRef}
        value={comment}
        onChange={handleChange}
        placeholder={placeholderText || "Add a comment..."}
        w="100%"
        minH="32px"
        maxH="calc(200px - 1rem)"
        resize="none"
        overflowY="auto"
        px="0.25rem"
        py={0}
        lineHeight="1.25"
        fontSize="16px"
        border="none"
        boxShadow="none"
        bg="transparent"
        color={comment ? theme.colors.black : theme.colors.gray[500]}
        _placeholder={{
          color: theme.colors.gray[500],
        }}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          boxShadow: "none !important",
          outline: "none !important",
          "&:focus": {
            boxShadow: "none !important",
            outline: "none !important",
          },
          "&:focus-visible": {
            boxShadow: "none !important",
            outline: "none !important",
          },
          "&:focus-within": {
            boxShadow: "none !important",
            outline: "none !important",
          },
        }}
      />
    </Box>
  );
}
