import React, { useState } from "react";
import {
  Box,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";

export default function AddComment({
  comment,
  setComment,
}: {
  comment: string;
  setComment: (newComment: string) => void;
}) {
  const handleChange = (newComment: string) => {
    setComment(newComment);
  };

  return (
    <Box
      w="calc(100%-0.5rem)"
      border="1px solid grey"
      borderRadius={"5px"}
      p="0.5rem"
    >
      <Editable
        value={comment}
        onChange={handleChange}
        placeholder="Add Comment"
      >
        <EditablePreview w="100%" />
        <EditableInput w="100%" />
      </Editable>
    </Box>
  );
}
