import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { ExerciseAggregate } from "../../../generated/frontend-types";
import theme from "../../../Constants/theme";

interface Props {
  buckets: ExerciseAggregate[];
  activeBucket: ExerciseAggregate | null;
  setActiveBucket: (activeBucket: ExerciseAggregate | null) => void;
}

function createGlowFilter(
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
  id: string,
  color: string
) {
  const filter = defs
    .append("filter")
    .attr("id", id)
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");

  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", 4)
    .attr("result", "blur");

  filter
    .append("feFlood")
    .attr("flood-color", color)
    .attr("flood-opacity", 0.7)
    .attr("result", "color");

  filter
    .append("feComposite")
    .attr("in", "color")
    .attr("in2", "blur")
    .attr("operator", "in")
    .attr("result", "glow");

  const merge = filter.append("feMerge");
  merge.append("feMergeNode").attr("in", "glow");
  merge.append("feMergeNode").attr("in", "SourceGraphic");
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

    // Definitions
    const defs = svg.append("defs");
    createGlowFilter(
      defs,
      "glowWorkCapacity",
      theme.colors.graphSecondary[500]
    );

    // Left Y axis
    const yAxisLeftGroup = g.append("g").call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .tickFormat(() => "")
    );

    yAxisLeftGroup.select(".domain").remove();

    // Right Y axis
    const yAxisRight = d3
      .axisRight(y)
      .ticks(4)
      .tickSize(-innerWidth)
      .tickFormat((d) => {
        const value = Number(d);
        if (value >= 1000) {
          return `${value / 1000}k`;
        }
        return `${value}`;
      });

    const yAxisRightGroup = g
      .append("g")
      .attr("transform", `translate(${innerWidth},0)`)
      .call(yAxisRight);
    yAxisRightGroup
      .selectAll("path, line")
      .attr("stroke", theme.colors.grey[200]);
    yAxisRightGroup.select(".domain").remove();

    yAxisRightGroup
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", theme.colors.graphSecondary[500])
      .style("font-weight", "500");

    // Chart borders
    g.append("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", theme.colors.grey[300]);

    g.append("line")
      .attr("x1", innerWidth)
      .attr("x2", innerWidth)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", theme.colors.grey[300]);

    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", innerHeight)
      .attr("y2", innerHeight)
      .attr("stroke", theme.colors.grey[300]);

    // Area
    const area = d3
      .area<ExerciseAggregate>()
      .x((d) => (x(d.periodStart) ?? 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.totalWorkCapacityKg))
      .curve(d3.curveLinear);

    g.append("path")
      .datum(sortedBuckets)
      .attr("fill", theme.colors.graphSecondary[500])
      .attr("fill-opacity", 0.18)
      .attr("stroke", "none")
      .attr("d", area);

    // Line
    const line = d3
      .line<ExerciseAggregate>()
      .x((d) => (x(d.periodStart) ?? 0) + x.bandwidth() / 2)
      .y((d) => y(d.totalWorkCapacityKg))
      .curve(d3.curveLinear);

    g.append("path")
      .datum(sortedBuckets)
      .attr("fill", "none")
      .attr("stroke", theme.colors.graphSecondary[500])
      .attr("stroke-width", 2)
      .attr("d", line);

    // Points
    const points = g
      .selectAll(".trend-point")
      .data(sortedBuckets)
      .enter()
      .append("circle")
      .attr("class", "trend-point")
      .attr("cx", (d) => (x(d.periodStart) ?? 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.totalWorkCapacityKg))
      .attr("r", 4)
      .attr("fill", theme.colors.white)
      .attr("stroke", theme.colors.graphSecondary[500])
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Hover area
    g.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);

        const closestBucket = sortedBuckets.reduce((closest, bucket) => {
          const bucketX = (x(bucket.periodStart) ?? 0) + x.bandwidth() / 2;
          if (!closest) {
            return bucket;
          }
          const closestX = (x(closest.periodStart) ?? 0) + x.bandwidth() / 2;

          return Math.abs(mouseX - bucketX) < Math.abs(mouseX - closestX)
            ? bucket
            : closest;
        }, null as ExerciseAggregate | null);

        if (closestBucket) {
          setActiveBucket(closestBucket);
        }
      })
      .on("mouseleave", () => {
        setActiveBucket(null);
      });

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
        .attr("fill", theme.colors.graphSecondary[500])
        .attr("filter", "url(#glowWorkCapacity)");
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [buckets, activeBucket, setActiveBucket]);

  return (
    <div
      style={{
        width: "100%",
        height: "200px",
      }}
    >
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
