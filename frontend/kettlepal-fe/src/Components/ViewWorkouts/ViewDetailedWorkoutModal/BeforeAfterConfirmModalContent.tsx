import { Box, Text } from "@chakra-ui/react";
import theme from "../../../Constants/theme";
import { formatExerciseString } from "../../../utils/Exercises/exercises";
import { FuzzySearchQuery } from "../../../generated/frontend-types";
import dayjs from "dayjs";
import { CreateWorkoutState } from "../../../Hooks/useCreateWorkoutForm";

interface BeforeAfterConfirmModalConentProps {
  before: NonNullable<
    NonNullable<FuzzySearchQuery["pastWorkouts"]>["workoutWithExercises"]
  >[0];
  after: CreateWorkoutState;
}

export default function BeforeAfterConfirmModalConent({
  before,
  after,
}: BeforeAfterConfirmModalConentProps) {
  return (
    <Box mb="1rem" mt="-1rem">
      <Text color={theme.colors.grey[600]}>
        <i>Are you sure your workout is complete, and ready to be updated?</i>
      </Text>

      {/* NEW WORKOUT */}
      <Box mt="1rem">
        <Text
          fontSize="24px"
          color={theme.colors.green[600]}
          textAlign={"center"}
          w="100%"
          mb="0.5rem"
        >
          <b>New Workout</b>
        </Text>
        {(after?.exercises?.length ?? 0) > 0 && (
          <>
            {after.date && (
              <>
                <Text fontSize="18" m="0" color={theme.colors.grey[700]}>
                  <b>{dayjs(after.date).format("dddd, MMMM DD, YYYY")}</b>
                </Text>
              </>
            )}
            {after.comment && (
              <Text fontSize="14px" color={theme.colors.grey[700]}>
                <i>{after.comment}</i>
              </Text>
            )}
            {after?.exercises?.map((exercise, index) => {
              return (
                <Text ml="1rem" key={index}>
                  {formatExerciseString(exercise)} <br />
                </Text>
              );
            })}
          </>
        )}
      </Box>

      {/* OLD WORKOUT */}
      <Box mt="1rem">
        <Text
          fontSize="24px"
          color={theme.colors.grey[600]}
          textAlign={"center"}
          w="100%"
          mb="0.5rem"
        >
          <b>Old Workout</b>
        </Text>
        {(before?.exercises?.length ?? 0) > 0 && (
          <>
            {before?.date && (
              <>
                <Text fontSize="18" m="0" color={theme.colors.grey[700]}>
                  <b>{dayjs(before?.date).format("dddd, MMMM DD, YYYY")}</b>
                </Text>
              </>
            )}
            {before?.comment && (
              <Text fontSize="14px" color={theme.colors.grey[700]}>
                <i>{before?.comment}</i>
              </Text>
            )}
            {before?.exercises?.map((exercise, index) => {
              return (
                <Text ml="1rem" key={index}>
                  {formatExerciseString(exercise)} <br />
                </Text>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
}
