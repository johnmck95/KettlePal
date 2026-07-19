import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import { ExerciseAggregate } from "../../../generated/frontend-types";
import { Box, Wrap, WrapItem, Text } from "@chakra-ui/react";
import theme from "../../../Constants/theme";
import {
  weightInKg,
  STANDARD_KETTLEBELL_COLOURS,
  weightLabel,
} from "../../../utils/Visualiations/constants";

interface Props {
  buckets: ExerciseAggregate[];
  activeBucket: ExerciseAggregate | null;
  colourMap: Map<string, string>;
  uniqueWeights: { label: string; sortWeightKg: number }[];
  setActiveBucket: (activeBucket: ExerciseAggregate | null) => void;
}

export default function StackedBarChart({
  buckets,
  activeBucket,
  colourMap,
  uniqueWeights,
  setActiveBucket,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

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
      top: 10,
      right: 25,
      bottom: 20,
      left: 10,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Sort buckets chronologically
    const sortedBuckets = [...buckets].sort(
      (a, b) =>
        new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime()
    );

    const firstBucket = sortedBuckets[0];
    const bucketDays =
      (new Date(firstBucket.periodEnd).getTime() -
        new Date(firstBucket.periodStart).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    let dateFormatter: (date: Date) => string;

    if (bucketDays <= 2) {
      // Daily
      dateFormatter = d3.utcFormat("%b %-d, %Y"); // Jul 5, 2026
    } else if (bucketDays <= 8) {
      // Weekly
      dateFormatter = d3.utcFormat("%b %Y"); // Jul 2026
    } else if (bucketDays <= 32) {
      // Monthly
      dateFormatter = d3.utcFormat("%b %Y"); // Jul '26
    } else {
      // Yearly
      dateFormatter = d3.utcFormat("%Y"); // 2026
    }

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
      const isActive =
        activeBucket?.periodStart === bucket.periodStart &&
        activeBucket?.periodEnd === bucket.periodEnd;

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
        .attr("opacity", isActive ? 1 : 0)
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
          setActiveBucket(bucket);
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
  }, [buckets, colour, activeBucket]);

  return (
    <div style={{ width: "100%" }}>
      <svg
        ref={svgRef}
        style={{
          width: "100%",
          height: "100px",
        }}
      />
      <Wrap spacing={[2, 4, 6]} justify="center" my="1rem">
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
