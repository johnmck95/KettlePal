import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { ExerciseAggregate } from "../../../generated/frontend-types";
import theme from "../../../Constants/theme";
import {
  STANDARD_KETTLEBELL_COLOURS,
  createGlowFilter,
  weightLabel,
} from "../../../utils/Visualiations/constants";

interface Props {
  buckets: ExerciseAggregate[];
  activeBucket: ExerciseAggregate | null;
  setActiveBucket: (activeBucket: ExerciseAggregate | null) => void;
}

function dominantWeight(bucket: ExerciseAggregate): string | null {
  if (bucket.workCapacityComponents.length === 0) {
    return null;
  }

  return weightLabel(
    bucket.workCapacityComponents.reduce((max, component) =>
      component.workCapacityKg > max.workCapacityKg ? component : max
    )
  );
}

export default function Trendline({
  buckets,
  activeBucket,
  setActiveBucket,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;

    if (!svgEl || buckets.length === 0) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth || 600;
    const height = 200;

    const margin = {
      top: 16,
      right: 25,
      bottom: 10,
      left: 10,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const sortedBuckets = [...buckets].sort(
      (a, b) =>
        new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime()
    );

    const x = d3
      .scaleBand()
      .domain(sortedBuckets.map((d) => d.periodStart))
      .range([0, innerWidth])
      .padding(0);

    const maxWork = d3.max(sortedBuckets, (d) => d.totalWorkCapacityKg) || 1;

    const y = d3
      .scaleLinear()
      .domain([0, maxWork])
      .range([innerHeight, 0])
      .nice();

    const getWeightColour = (bucket: ExerciseAggregate) =>
      STANDARD_KETTLEBELL_COLOURS[dominantWeight(bucket) ?? ""] ??
      theme.colors.graphSecondary[500];

    // Definitions
    const defs = svg.append("defs");

    createGlowFilter(
      defs,
      "glowWorkCapacity",
      theme.colors.graphSecondary[500]
    );

    // Axes
    const yAxisLeftGroup = g.append("g").call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .tickFormat(() => "")
    );

    yAxisLeftGroup.select(".domain").remove();

    const yAxisRightGroup = g
      .append("g")
      .attr("transform", `translate(${innerWidth},0)`)
      .call(
        d3
          .axisRight(y)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat((d) => {
            const value = Number(d);
            return value >= 1000 ? `${value / 1000}k` : `${value}`;
          })
      );

    yAxisRightGroup
      .selectAll("path, line")
      .attr("stroke", theme.colors.grey[200]);

    yAxisRightGroup.select(".domain").remove();

    yAxisRightGroup
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", theme.colors.graphSecondary[500])
      .style("font-weight", "500");

    // Borders
    [
      [0, 0, 0, innerHeight],
      [innerWidth, 0, innerWidth, innerHeight],
      [0, innerHeight, innerWidth, innerHeight],
    ].forEach(([x1, y1, x2, y2]) => {
      g.append("line")
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .attr("stroke", theme.colors.grey[300]);
    });

    // Dominant-weight coloured area shading
    const area = d3
      .area<ExerciseAggregate>()
      .x((d) => (x(d.periodStart) ?? 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.totalWorkCapacityKg))
      .curve(d3.curveMonotoneX);

    for (let i = 0; i < sortedBuckets.length - 1; i++) {
      g.append("path")
        .datum([sortedBuckets[i], sortedBuckets[i + 1]])
        .attr("fill", getWeightColour(sortedBuckets[i]))
        .attr("fill-opacity", 0.18)
        .attr("stroke", "none")
        .attr("d", area);
    }

    // Dominant-weight trendline
    const trendLine = d3
      .line<ExerciseAggregate>()
      .x((d) => (x(d.periodStart) ?? 0) + x.bandwidth() / 2)
      .y((d) => y(d.totalWorkCapacityKg))
      .curve(d3.curveMonotoneX);

    for (let i = 0; i < sortedBuckets.length - 1; i++) {
      g.append("path")
        .datum([sortedBuckets[i], sortedBuckets[i + 1]])
        .attr("fill", "none")
        .attr("stroke", getWeightColour(sortedBuckets[i]))
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("d", trendLine);
    }

    // Points
    g.selectAll(".trend-point")
      .data(sortedBuckets)
      .enter()
      .append("circle")
      .attr("class", "trend-point")
      .attr("cx", (d) => (x(d.periodStart) ?? 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.totalWorkCapacityKg))
      .attr("r", 4)
      .attr("fill", theme.colors.white)
      .attr("stroke", (d) => getWeightColour(d))
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 7)
          .attr("fill", getWeightColour(d))
          .attr("stroke-width", 3);
      })
      .on("mouseleave", function (_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 4)
          .attr("fill", theme.colors.white)
          .attr("stroke-width", 2);
      });

    // Hover
    g.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);

        const closestBucket = sortedBuckets.reduce((closest, bucket) => {
          if (!closest) return bucket;

          const bucketX = (x(bucket.periodStart) ?? 0) + x.bandwidth() / 2;

          const closestX = (x(closest.periodStart) ?? 0) + x.bandwidth() / 2;

          return Math.abs(mouseX - bucketX) < Math.abs(mouseX - closestX)
            ? bucket
            : closest;
        }, null as ExerciseAggregate | null);

        setActiveBucket(closestBucket);
      })
      .on("mouseleave", () => setActiveBucket(null));

    // Active bucket
    if (activeBucket) {
      const xPos = (x(activeBucket.periodStart) ?? 0) + x.bandwidth() / 2;

      const yPos = y(activeBucket.totalWorkCapacityKg);

      g.append("line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", yPos + 8)
        .attr("y2", innerHeight)
        .attr("stroke", "#A0AEC6")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4 4");

      g.append("circle")
        .attr("cx", xPos)
        .attr("cy", yPos)
        .attr("r", 8)
        .attr("fill", getWeightColour(activeBucket))
        .attr("filter", "url(#glowWorkCapacity)");
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [buckets, activeBucket, setActiveBucket]);

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <svg
        ref={svgRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
