import React from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import theme from "../../../Constants/theme";

interface SearchBarProps {
  onSearchSubmit: (finalQuery: string) => void;
}

export default function SearchBar({ onSearchSubmit }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  function handleSubmit() {
    onSearchSubmit(searchQuery);
  }

  return (
    <Box
      borderRadius={6}
      w="100%"
      transition="all 0.15s ease"
      _hover={{
        boxShadow: `0 0 0 1px ${theme.colors.green[50]}`,
      }}
      _focusWithin={{
        boxShadow: `0 0 0 1px ${theme.colors.green[400]}`,
      }}
    >
      <InputGroup size="md">
        <InputLeftElement pointerEvents="none">
          <FaSearch color={theme.colors.grey[600]} />
        </InputLeftElement>

        <Input
          bg={theme.colors.white}
          color={theme.colors.black}
          placeholder="Search..."
          type="text"
          name="searchQuery"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          border={`1px solid ${theme.colors.green[400]}`}
          borderRight="none"
          borderRightRadius={0}
          borderLeftRadius={4}
          focusBorderColor={theme.colors.green[500]}
          sx={{
            _hover: {
              borderColor: theme.colors.green[500],
            },
          }}
        />

        <InputRightAddon p={0} bg="transparent" border="none">
          <Button
            m={0}
            size="md"
            variant="primary"
            borderLeftRadius={0}
            borderRightRadius={4}
            onClick={handleSubmit}
            sx={{
              _hover: {
                bg: theme.colors.green[600],
              },
              _active: {
                bg: theme.colors.green[800],
              },
            }}
          >
            Search
          </Button>
        </InputRightAddon>
      </InputGroup>
    </Box>
  );
}
