import { VStack, HStack, Text, Icon } from "@chakra-ui/react";
import React from "react";
import SearchBar from "./SearchBar";
import theme from "../../../Constants/theme";
import { FaTimes } from "react-icons/fa";

interface FiltersProps {
  searchQuery: string;
  resetSearchQuery: () => void;
  onSearchSubmit: (finalQuery: string) => void;
}

export default function Filters({
  searchQuery,
  resetSearchQuery,
  onSearchSubmit,
}: FiltersProps) {
  return (
    <VStack w="100%" mt="0.4rem" mb="0.8rem">
      <SearchBar onSearchSubmit={onSearchSubmit} />
      {searchQuery && (
        <HStack>
          <Text fontSize="12px" color={theme.colors.grey[500]}>
            <b>Results for:</b> <i>{searchQuery}</i>
          </Text>
          <Icon
            as={FaTimes}
            aria-label="Remove-Search"
            color={theme.colors.grey[500]}
            onClick={resetSearchQuery}
          />
        </HStack>
      )}
    </VStack>
  );
}
