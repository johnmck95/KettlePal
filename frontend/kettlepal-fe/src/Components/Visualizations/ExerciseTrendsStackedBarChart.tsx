import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  ExerciseAggregate,
  WorkCapacityComponent,
} from "../../generated/frontend-types";
import { Box, Wrap, WrapItem, Text } from "@chakra-ui/react";
import theme from "../../Constants/theme";

interface Props {
  buckets: ExerciseAggregate[];
  setActiveBucket: (activeBucket: ExerciseAggregate | null) => void;
}

const LB_TO_KG = 0.45359237;
const weightInKg = (weight: number, unit: string): number =>
  unit === "lb" ? weight * LB_TO_KG : weight;
const weightLabel = (component: WorkCapacityComponent): string =>
  `${component.weight} ${component.weightUnit}`;

export default function ExerciseTrendsStackedBarChart({
  buckets,
  setActiveBucket,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const uniqueWeights = Array.from(
    new Map(
      buckets
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

  const STANDARD_KETTLEBELL_COLOURS: Record<string, string> = {
    "8 kg": theme.colors.green[100],
    "10 kg": theme.colors.feldgrau[100],
    "12 kg": theme.colors.grey[600],
    "14 kg": theme.colors.grey[500],
    "16 kg": theme.colors.olive[100],
    "18 kg": theme.colors.green[500],
    "20 kg": theme.colors.lion[500],
    "22 kg": theme.colors.lion[700],
    "24 kg": theme.colors.graphPrimary[500],
    "26 kg": theme.colors.feldgrau[600],
    "28 kg": theme.colors.bole[500],
    "30 kg": theme.colors.bole[700],
    "32 kg": theme.colors.grey[800],
  };

  const generateColour = (index: number): string => {
    // Golden angle gives visually distributed colours
    const hue = (index * 137.508) % 360;

    return `hsl(${hue}, 60%, 55%)`;
  };

  const colourMap = new Map<string, string>();

  uniqueWeights.forEach((weight, index) => {
    const standardColour = STANDARD_KETTLEBELL_COLOURS[weight.label];

    if (standardColour) {
      colourMap.set(weight.label, standardColour);
    } else {
      colourMap.set(
        weight.label,
        generateColour(index + Object.keys(STANDARD_KETTLEBELL_COLOURS).length)
      );
    }
  });

  const colour = useCallback(
    (weightLabel: string) => colourMap.get(weightLabel) ?? "#999",
    [colourMap]
  );

  useEffect(() => {
    const svgEl = svgRef.current;

    if (!svgEl || buckets.length === 0) {
      return;
    }

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth || 600;
    const height = svgEl.clientHeight || 300;

    const margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Sort buckets chronologically
    const sortedBuckets = [...buckets].sort(
      (a, b) =>
        new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime()
    );
    const first = new Date(sortedBuckets[0].periodStart);
    const last = new Date(sortedBuckets[sortedBuckets.length - 1].periodStart);

    const spanYears = last.getFullYear() - first.getFullYear();

    const dateFormatter =
      spanYears === 0
        ? d3.timeFormat("%b %d") // Jan 05
        : spanYears <= 3
        ? d3.timeFormat("%b %Y") // Jan 2024
        : d3.timeFormat("%Y"); // 2024

    // Scales
    const x = d3
      .scaleBand<string>()
      .domain(sortedBuckets.map((bucket) => bucket.periodStart))
      .range([0, innerWidth])
      .paddingInner(0.02)
      .paddingOuter(0.01);

    const maxWork =
      d3.max(sortedBuckets, (bucket) => bucket.totalWorkCapacityKg) ?? 0;

    const y = d3
      .scaleLinear()
      .domain([0, maxWork])
      .nice()
      .range([innerHeight, 0]);

    // Main chart group
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw stacked bars
    sortedBuckets.forEach((bucket) => {
      const xPos = x(bucket.periodStart);

      if (xPos === undefined) {
        return;
      }

      let accumulated = 0;

      // Lightest weight at bottom
      const sortedComponents = [...bucket.workCapacityComponents].sort(
        (a, b) =>
          weightInKg(a.weight, a.weightUnit) -
          weightInKg(b.weight, b.weightUnit)
      );

      sortedComponents.forEach((component) => {
        const start = accumulated;

        accumulated += component.workCapacityKg;

        chart
          .append("rect")
          .attr("x", xPos)
          .attr("width", x.bandwidth())
          .attr("y", y(accumulated))
          .attr("height", y(start) - y(accumulated))
          .attr("fill", colour(weightLabel(component)));
      });
    });

    // Tell parent component when a bar is hovered
    sortedBuckets.forEach((bucket) => {
      const xPos = x(bucket.periodStart);
      if (xPos === undefined) {
        return;
      }
      const barTop = y(bucket.totalWorkCapacityKg);
      const barHeight = innerHeight - barTop;

      const highlight = chart
        .append("rect")
        .attr("x", xPos - 1)
        .attr("y", barTop - 1)
        .attr("width", x.bandwidth() + 2)
        .attr("height", barHeight + 2)
        .attr("fill", "rgba(0,0,0,0.32)")
        .attr("stroke", theme.colors.grey[400])
        .attr("stroke-width", 2)
        .attr("rx", 2)
        .attr("opacity", 0)
        .style("pointer-events", "none");

      chart
        .append("rect")
        .attr("x", xPos)
        .attr("y", 0)
        .attr("width", x.bandwidth())
        .attr("height", innerHeight)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseenter", () => {
          highlight.interrupt().transition().duration(120).attr("opacity", 1);
          setActiveBucket(bucket);
        })
        .on("mouseleave", () => {
          highlight.interrupt().transition().duration(120).attr("opacity", 0);
          setActiveBucket(null);
        });
    });

    // X Axis
    const maxLabels = Math.floor(innerWidth / 80);

    const tickValues = sortedBuckets
      .filter(
        (_, index) => index % Math.ceil(sortedBuckets.length / maxLabels) === 0
      )
      .map((bucket) => bucket.periodStart);

    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(tickValues)
          .tickFormat((value) => dateFormatter(new Date(value)))
      );

    return () => {
      svg.selectAll("*").remove();
    };
  }, [buckets, colour]);

  return (
    <div style={{ width: "100%" }}>
      <svg
        ref={svgRef}
        style={{
          width: "100%",
          height: "100px",
        }}
      />
      <Wrap spacing="18px" justify="center" my="1rem">
        {uniqueWeights.map((weight) => (
          <WrapItem key={weight.label} alignItems="center">
            <Box
              w="16px"
              h="16px"
              borderRadius="50%"
              bg={colour(weight.label)}
            />
            <Text ml="6px" fontSize={"xs"}>
              {weight.label}
            </Text>
          </WrapItem>
        ))}
      </Wrap>
    </div>
  );
}
