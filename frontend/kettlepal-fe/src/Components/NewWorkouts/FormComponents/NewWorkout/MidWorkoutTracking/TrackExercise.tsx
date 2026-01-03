import { FormLabel, HStack, IconButton } from "@chakra-ui/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import theme from "../../../../../Constants/theme";
import { CreateOrUpdateWorkoutState } from "../../../../../Hooks/HookHelpers/validation";

interface TrackExerciseProps {
  trackWorkout: boolean;
  completedSets: number;
  exercise: CreateOrUpdateWorkoutState["exercises"][number];
  removedASet: () => void;
  completedASet: () => void;
}

export default function TrackExercise({
  trackWorkout,
  completedSets,
  exercise,
  removedASet,
  completedASet,
}: TrackExerciseProps) {
  return (
    <>
      {trackWorkout && (
        <HStack justifyContent={"space-between"} w="100%">
          <FormLabel size={["sm", "md", "lg"]} my="auto">
            <b>{`Completed ${completedSets} / ${
              exercise.sets.value === "" ? "0" : exercise.sets.value
            } Sets`}</b>
          </FormLabel>
          <HStack>
            <IconButton
              aria-label="Subtract Set"
              icon={<FaMinus />}
              size={["sm"]}
              color={theme.colors.white}
              bg={
                completedSets === 0
                  ? theme.colors.grey[500]
                  : theme.colors.bole[500]
              }
              _hover={{
                bg:
                  completedSets === 0
                    ? theme.colors.grey[500]
                    : theme.colors.bole[500],
              }}
              _active={{
                bg:
                  completedSets === 0
                    ? theme.colors.grey[500]
                    : theme.colors.bole[600],
              }}
              onClick={removedASet}
            />
            <IconButton
              aria-label="Add Set"
              icon={<FaPlus />}
              size={["sm"]}
              color={theme.colors.white}
              bg={theme.colors.feldgrau[400]}
              _hover={{ bg: theme.colors.feldgrau[500] }}
              _active={{ bg: theme.colors.feldgrau[600] }}
              onClick={completedASet}
            />
          </HStack>
        </HStack>
      )}
    </>
  );
}
