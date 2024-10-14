import { HStack } from "@chakra-ui/react";
import React from "react";
import SearchBar from "./SearchBar";

interface FiltersProps {
  // searchQuery: string;
  // handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (finalQuery: string) => void;
}

export default function Filters({
  // searchQuery,
  // handleChange,
  onSearchSubmit,
}: FiltersProps) {
  return (
    <HStack>
      <SearchBar
        // searchQuery={searchQuery}
        // handleChange={handleChange}
        onSearchSubmit={onSearchSubmit}
      />
    </HStack>
  );
}
