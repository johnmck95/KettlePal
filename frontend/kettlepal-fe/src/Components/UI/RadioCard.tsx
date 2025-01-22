import React from "react";
import { Button, HStack } from "@chakra-ui/react";

interface RadioCardProps {
  label: string;
  value: string;
  handleClick: (value: string) => void;

  selected: boolean;
}

export function RadioCard({
  label,
  value,
  handleClick,
  selected,
}: RadioCardProps) {
  return (
    <Button
      size={["xs", "sm"]}
      padding={["0rem"]}
      onClick={() => handleClick(value)}
      variant={selected ? "primary" : "secondary"}
      value={value}
      height="10px"
    >
      {label}
    </Button>
  );
}

interface RadioGroupProps {
  items: string[];
  selected: string;
  handleClick: (value: string) => void;
}
export function RadioGroup({ items, selected, handleClick }: RadioGroupProps) {
  return (
    <HStack gap={["0.1rem", "0.2rem"]}>
      {items.map((item) => (
        <RadioCard
          key={item}
          label={item}
          value={item}
          handleClick={handleClick}
          selected={selected === item}
        />
      ))}
    </HStack>
  );
}
