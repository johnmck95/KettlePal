import { Text, VStack, Flex } from "@chakra-ui/react";
import React from "react";
import theme from "../../../Constants/theme";
import {
  calculateExerciseWorkCapacity,
  formatExerciseString,
} from "../../../utils/Exercises/exercises";
import { formatDurationShort } from "../../../utils/Time/time";
import { Exercise } from "../../../generated/frontend-types";

import Detail from "./Detail";

interface ViewDetailedExerciseProps {
  exercise: Omit<Exercise, "workoutUid">;
  showDetails: boolean;
}

export default function ViewDetailedExercise({
  exercise,
  showDetails,
}: ViewDetailedExerciseProps) {
  const {
    elapsedSeconds,
    sets,
    reps,
    weight,
    weightUnit,
    comment,
    multiplier,
  } = exercise;

  return (
    <VStack
      w="100%"
      alignItems={"flex-start"}
      gap={0}
      color={theme.colors.grey[800]}
      my={showDetails ? "1rem" : "0"}
    >
      <Text
        fontSize={showDetails ? "xl" : "md"}
        color={theme.colors.black}
        mt={showDetails ? "1rem" : "0.25rem"}
      >
        <b>{formatExerciseString(exercise)}</b>
      </Text>

      {!!comment && showDetails && (
        <Text ml="0.5rem" fontSize="sm" color={theme.colors.grey[700]}>
          <i>{comment}</i>
        </Text>
      )}
      {showDetails && (
        <Flex
          justifyContent="space-evenly"
          flexWrap="wrap"
          mt="0.5rem"
          w="100%"
        >
          {!!elapsedSeconds && (
            <Detail
              title={"Elapsed Time"}
              value={formatDurationShort(elapsedSeconds ?? 0)}
            />
          )}
          {!!sets && !!reps && (
            <Detail
              title={"Total Reps"}
              value={`${(sets * reps).toLocaleString()}`}
            />
          )}
          {!!sets && !!reps && !!weight && !!weightUnit && (
            <Detail
              title={"Work Capacity"}
              value={`${calculateExerciseWorkCapacity(exercise).toFixed(
                0
              )} ${weightUnit}`}
            />
          )}
          <Detail title={"Multiplier"} value={multiplier.toFixed(2)} />
        </Flex>
      )}
    </VStack>
  );
}
