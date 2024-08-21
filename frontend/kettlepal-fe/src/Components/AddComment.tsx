import React from "react";
import theme from "../Constants/theme";
import {
  Box,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";

export default function AddComment({
  placeholderText,
  comment,
  setComment,
  maxWidth,
}: {
  placeholderText?: string;
  comment: string;
  setComment: (newComment: string) => void;
  maxWidth?: string;
}) {
  const handleChange = (newComment: string) => {
    setComment(newComment);
  };

  return (
    <Box
      w="100%"
      border="1px solid grey"
      borderRadius={"5px"}
      p="0rem 0.5rem"
      maxW={maxWidth}
      bg="white"
    >
      <Editable
        value={comment}
        onChange={handleChange}
        placeholder={placeholderText || "Add a comment..."}
      >
        <EditablePreview
          w="100%"
          sx={{
            color: comment ? theme.colors.black : theme.colors.gray[500],
          }}
        />
        <EditableInput
          w="100%"
          sx={{
            _placeholder: { color: theme.colors.gray[500] },
          }}
        />
      </Editable>
    </Box>
  );
}
