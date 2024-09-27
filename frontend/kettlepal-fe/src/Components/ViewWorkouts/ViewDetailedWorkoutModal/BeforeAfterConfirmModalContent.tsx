import { Box, Text } from "@chakra-ui/react";
import theme from "../../../Constants/theme";
import { formatExerciseString } from "../../../utils/Exercises/exercises";
import { CreateWorkoutState } from "../../NewWorkouts/CreateWorkout";
import { UserWithWorkoutsQuery } from "../../../generated/frontend-types";
import dayjs from "dayjs";
import { postgresToDayJs } from "../../../utils/Time/time";

interface BeforeAfterConfirmModalConentProps {
  before: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
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
            {after.createdAt && (
              <>
                <Text fontSize="18" m="0" color={theme.colors.grey[700]}>
                  <b>{dayjs(after.createdAt).format("dddd, MMMM DD, YYYY")}</b>
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
            {before?.createdAt && (
              <>
                <Text fontSize="18" m="0" color={theme.colors.grey[700]}>
                  <b>
                    {postgresToDayJs(before?.createdAt).format(
                      "dddd, MMMM DD, YYYY"
                    )}
                  </b>
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
