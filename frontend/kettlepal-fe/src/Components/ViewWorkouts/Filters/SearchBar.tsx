import React from "react";
import {
  Button,
  InputLeftElement,
  Input,
  InputGroup,
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

  return (
    <InputGroup
      size="md"
      borderRadius={30}
      boxShadow={`0px 1px 4px ${theme.colors.grey[400]}`}
    >
      <InputLeftElement
        pointerEvents="none"
        children={<FaSearch color="gray.600" />}
      />
      <Input
        borderRadius={30}
        placeholder="Search..."
        color={theme.colors.black}
        focusBorderColor={theme.colors.green[300]}
        bg={theme.colors.white}
        type="text"
        name="searchQuery"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSearchSubmit(searchQuery);
          }
        }}
      />
      <InputRightAddon p={0} border="none" borderRightRadius={30}>
        <Button
          size="md"
          borderLeftRadius={0}
          borderRightRadius={30}
          variant="primary"
          sx={{
            _focus: {
              borderColor: theme.colors.green[300],
              boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
            },
          }}
          onClick={() => onSearchSubmit(searchQuery)}
        >
          Search
        </Button>
      </InputRightAddon>
    </InputGroup>
  );
}
