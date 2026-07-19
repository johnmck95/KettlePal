import {
  Alert,
  AlertDescription,
  AlertIcon,
  Center,
  CloseButton,
  FormControl,
  FormLabel,
  HStack,
  Select,
  VStack,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Heading,
  Flex,
} from "@chakra-ui/react";
import {
  ExerciseAggregate,
  useExerciseTrendsQuery,
} from "../generated/frontend-types";
import theme from "../Constants/theme";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../Contexts/UserContext";
import LoadingSpinner from "./LoadingSpinner";
import {
  dateToDayNumber,
  dayNumberToDate,
  formatSelectedDateRange,
} from "../utils/Time/time";
import StackedBarChart from "./Visualizations/ExerciseTrends/StackedBarChart";
import Trendline from "./Visualizations/ExerciseTrends/Trendline";
import WorkCapacityBars from "./WorkCapacityBars";
import {
  STANDARD_KETTLEBELL_COLOURS,
  generateColour,
  weightInKg,
  weightLabel,
} from "../utils/Visualiations/constants";

export default function ExerciseTrends() {
  const [uniqueExerciseTitles, setUniqueExerciseTitles] = useState([""]);
  const [exerciseTitle, setExerciseTitle] = useState(uniqueExerciseTitles[0]);
  // YYYY-MM-DD representation of the date range
  const [selectedDateRange, setSelectedDateRange] = useState<[string, string]>([
    "",
    "",
  ]);
  // Numerical representation of the date range
  const [sliderRange, setSliderRange] = useState<[number, number]>([0, 0]);
  const user = useUser().user;
  const [showServerError, setShowServerError] = useState<boolean>(false);
  const [activeBucket, setActiveBucket] = useState<ExerciseAggregate | null>(
    null
  );

  const { loading, error, data } = useExerciseTrendsQuery({
    variables: { uid: user?.uid ?? "", exerciseTitle },
  });
  const exerciseTrends = data?.user?.exerciseTrends;

  useEffect(() => {
    if (error) {
      setShowServerError(true);
    }
  }, [error]);

  // Initialize controls from incoming data
  useEffect(() => {
    if (exerciseTrends?.rangeStart && exerciseTrends?.rangeEnd) {
      const start = dateToDayNumber(exerciseTrends.rangeStart);
      const end = dateToDayNumber(exerciseTrends.rangeEnd);

      setSliderRange([start, end]);

      setSelectedDateRange([
        exerciseTrends.rangeStart,
        exerciseTrends.rangeEnd,
      ]);
    }
    if (data?.uniqueExerciseTitles) {
      setUniqueExerciseTitles(data.uniqueExerciseTitles);
      // Only initialize once
      if (!exerciseTitle && data.uniqueExerciseTitles.length > 0) {
        setExerciseTitle(data.uniqueExerciseTitles[0]);
      }
    }
  }, [
    data,
    exerciseTitle,
    exerciseTrends?.rangeStart,
    exerciseTrends?.rangeEnd,
  ]);
  const dataRangeShown = formatSelectedDateRange(
    activeBucket?.periodStart ?? selectedDateRange[0],
    activeBucket?.periodEnd ?? selectedDateRange[1]
  );

  const MAX_BUCKETS = 25;

  const filterBuckets = (buckets?: ExerciseAggregate[]) =>
    buckets?.filter((bucket) => {
      const bucketStart = dateToDayNumber(bucket.periodStart);
      const bucketEnd = dateToDayNumber(bucket.periodEnd);

      return bucketEnd >= sliderRange[0] && bucketStart <= sliderRange[1];
    }) ?? [];

  const filteredBucketOptions = [
    filterBuckets(exerciseTrends?.dailyBuckets),
    filterBuckets(exerciseTrends?.weeklyBuckets),
    filterBuckets(exerciseTrends?.monthlyBuckets),
    filterBuckets(exerciseTrends?.yearlyBuckets),
  ];

  const filteredBuckets =
    filteredBucketOptions.find(
      (bucketOption) => bucketOption.length <= MAX_BUCKETS
    ) ?? filteredBucketOptions[filteredBucketOptions.length - 1];

  const sumWorkCapacityKg = filteredBuckets.reduce(
    (sum, bucket) => sum + bucket.totalWorkCapacityKg,
    0
  );

  const summedWorkCapacityKg =
    Math.round(
      activeBucket?.totalWorkCapacityKg ?? sumWorkCapacityKg ?? 0
    ).toLocaleString() + "kg";

  const uniqueWeights = Array.from(
    new Map(
      filteredBuckets
        .flatMap((bucket) => bucket.workCapacityComponents)
        .map((component) => [
          weightLabel(component),
          {
            label: weightLabel(component),
            sortWeightKg: weightInKg(component.weight, component.weightUnit),
          },
        ])
    ).values()
  ).sort((a, b) => a.sortWeightKg - b.sortWeightKg);

  const colourMap = useMemo(() => {
    const map = new Map<string, string>();
    uniqueWeights.forEach((weight, index) => {
      map.set(
        weight.label,
        STANDARD_KETTLEBELL_COLOURS[weight.label] ??
          generateColour(
            index + Object.keys(STANDARD_KETTLEBELL_COLOURS).length
          )
      );
    });

    return map;
  }, [uniqueWeights]);

  return (
    <VStack w="90%" mt="3.5rem">
      <Heading
        pb="1.5rem"
        size={["md", "lg"]}
        color={theme.colors.grey[700]}
        fontWeight={400}
        textDecoration="underline"
        textDecorationColor={theme.colors.grey[300]}
      >
        Exercise Trends
      </Heading>
      {showServerError ? (
        <Alert
          status="error"
          m="0.5rem"
          w="90%"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <AlertDescription>{error?.message}</AlertDescription>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      ) : (
        <>
          {loading ? (
            <Center h="100%" w="100%">
              <LoadingSpinner disableMessage={true} />
            </Center>
          ) : (
            <VStack w="100%">
              {/* EXERCISE SELECTOR & SELECTED PERIOD */}
              <HStack
                w="100%"
                alignItems="flex-start"
                justifyContent="space-between"
                mb={3}
              >
                {/* LEFT COLUMN */}
                <VStack w="50%" gap={3} alignItems="flex-start">
                  <Flex gap={0} alignItems={"flex-start"}>
                    <FormControl>
                      <VStack gap={0} alignItems={"flex-start"}>
                        <FormLabel
                          fontSize={["xs"]}
                          m={0}
                          fontWeight="medium"
                          color={theme.colors.grey[600]}
                        >
                          Exercise
                        </FormLabel>

                        <Select
                          size={["sm", "sm", "md"]}
                          fontSize="16px"
                          placeholder="Select"
                          name="exercise"
                          borderRadius="5px"
                          maxW={["150px", "240px"]}
                          focusBorderColor={theme.colors.green[300]}
                          color={theme.colors.black}
                          bg={theme.colors.white}
                          value={exerciseTitle}
                          onChange={(event) => {
                            setExerciseTitle(event.target.value);
                            setActiveBucket(null);
                          }}
                        >
                          {uniqueExerciseTitles.map((exercise) => (
                            <option key={exercise} value={exercise}>
                              {exercise}
                            </option>
                          ))}
                        </Select>
                      </VStack>
                    </FormControl>
                  </Flex>

                  <VStack gap={0} alignItems={"flex-start"}>
                    <Text
                      fontSize={["xs"]}
                      fontWeight="medium"
                      color={theme.colors.grey[600]}
                    >
                      Active Period
                    </Text>

                    <Text fontSize={["sm"]} fontWeight="bold">
                      {dataRangeShown}
                    </Text>
                  </VStack>

                  <VStack gap={0} alignItems={"flex-start"}>
                    <Text
                      fontSize={["xs"]}
                      fontWeight="medium"
                      color={theme.colors.grey[600]}
                    >
                      Work Capacity
                    </Text>

                    <Text fontSize={["sm"]} fontWeight="bold">
                      {summedWorkCapacityKg}
                    </Text>
                  </VStack>
                </VStack>

                {/* RIGHT COLUMN */}
                <VStack w="50%" justify="flex-start">
                  <Text
                    fontSize={["xs", "sm"]}
                    fontWeight="medium"
                    color={theme.colors.grey[600]}
                    textAlign="center"
                    mb="0.25rem"
                  >
                    Weights Used
                  </Text>

                  <WorkCapacityBars
                    activeBucket={activeBucket}
                    colourMap={colourMap}
                  />
                </VStack>
              </HStack>

              {/* VISUALIZATIONS */}
              {filteredBuckets && (
                <VStack w="100%" gap={0}>
                  <Trendline
                    buckets={filteredBuckets}
                    activeBucket={activeBucket}
                    colourMap={colourMap}
                    setActiveBucket={setActiveBucket}
                  />
                  <StackedBarChart
                    buckets={filteredBuckets}
                    activeBucket={activeBucket}
                    colourMap={colourMap}
                    uniqueWeights={uniqueWeights}
                    setActiveBucket={setActiveBucket}
                  />
                </VStack>
              )}

              {/* RANGE SLIDER */}
              {exerciseTrends?.rangeStart && exerciseTrends?.rangeEnd && (
                <VStack w="100%">
                  <RangeSlider
                    min={dateToDayNumber(exerciseTrends.rangeStart)}
                    max={dateToDayNumber(exerciseTrends.rangeEnd)}
                    value={sliderRange}
                    onChange={(value) => {
                      const [start, end] = value as [number, number];
                      setSliderRange([start, end]);
                      setSelectedDateRange([
                        dayNumberToDate(start),
                        dayNumberToDate(end),
                      ]);
                      setActiveBucket(null);
                    }}
                    step={1}
                    w="100%"
                  >
                    <RangeSliderTrack bg={theme.colors.graphSecondary[200]}>
                      <RangeSliderFilledTrack
                        bg={theme.colors.graphSecondary[500]}
                      />
                    </RangeSliderTrack>

                    <RangeSliderThumb
                      index={0}
                      bg={theme.colors.graphSecondary[500]}
                      borderColor={theme.colors.graphSecondary[800]}
                      _focus={{
                        bg: theme.colors.graphSecondary[500],
                        borderColor: theme.colors.graphSecondary[800],
                        boxShadow: "none",
                      }}
                    />
                    <RangeSliderThumb
                      index={1}
                      bg={theme.colors.graphSecondary[500]}
                      borderColor={theme.colors.graphSecondary[800]}
                      _focus={{
                        bg: theme.colors.graphSecondary[500],
                        borderColor: theme.colors.graphSecondary[800],
                        boxShadow: "none",
                      }}
                    />
                  </RangeSlider>

                  <HStack w="100%" justifyContent="space-between">
                    <Text fontSize="sm" color={theme.colors.grey[700]}>
                      {selectedDateRange[0]}
                    </Text>

                    <Text fontSize="sm" color={theme.colors.grey[700]}>
                      {selectedDateRange[1]}
                    </Text>
                  </HStack>
                </VStack>
              )}
            </VStack>
          )}
        </>
      )}
    </VStack>
  );
}
