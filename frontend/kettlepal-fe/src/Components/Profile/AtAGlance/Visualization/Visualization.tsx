import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import {
  WorkoutAggregate,
  WorkoutTrendsQuery,
} from "../../../../generated/frontend-types";
import theme from "../../../../Constants/theme";

interface VisualizationProps {
  workoutTrends: NonNullable<WorkoutTrendsQuery["user"]>["workoutTrends"];
  showTime: boolean;
  showWC: boolean;
  handleBucket: (bucket: WorkoutAggregate) => void;
  bucket: WorkoutAggregate;
  grain: "Daily" | "Weekly" | "Monthly" | "Annually";
}

// ---------- X-axis helpers ---------- //

function getTickCount(grain: VisualizationProps["grain"], n: number) {
  switch (grain) {
    case "Daily":
      return 7;
    case "Weekly":
      return 3;
    case "Monthly":
      return 4;
    case "Annually":
      return n;
    default:
      return 5;
  }
}

function getTickFormat(grain: VisualizationProps["grain"]) {
  switch (grain) {
    case "Daily":
      return d3.timeFormat("%a"); // Mon, Tue...
    case "Weekly":
    case "Monthly":
      return d3.timeFormat("%b"); // Jan, Feb...
    case "Annually":
      return d3.timeFormat("%Y"); // 2024, 2025...
    default:
      return d3.timeFormat("%b %d"); // Jan 3rd, Feb 5th...
  }
}

// ---------- Glow filter helper ---------- //

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

// ---------- Format helpers ---------- //

function formatDurationTick(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  if (seconds >= 60) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds)}s`;
}

function formatWorkTick(kg: number): string {
  return kg >= 1000 ? `${Math.round(kg / 1000)}k` : `${Math.round(kg)}`;
}

// ---------- Segment intersection helper ---------- //

type ScreenPoint = {
  x: number;
  yTime: number;
  yWork: number;
};

type RefinedPoint = ScreenPoint;

// -- Computes the intersection point of two line segments (if any) --
function segmentIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): { x: number; y: number } | null {
  // determinant
  const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (det === 0) return null; // no intersection

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

  // intersection point not between (x1, y1) & (x2, y2)
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1),
  };
}

export default function Visualization({
  workoutTrends,
  showTime,
  showWC,
  handleBucket,
  bucket,
  grain,
}: VisualizationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !workoutTrends.buckets.length) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const buckets = workoutTrends.buckets;
    const width = svgEl.clientWidth || 600;
    const height = svgEl.clientHeight || 400;
    const margin = { top: 16, right: 60, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // g = Group, the svg container element
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ---------- Scales ---------- //

    const parseDate = d3.timeParse("%Y-%m-%d");
    const xExtent = d3.extent(buckets, (d) => parseDate(d.periodStart)!) as [
      Date,
      Date
    ];

    const xScale = d3.scaleTime().domain(xExtent).range([0, innerWidth]);

    const maxDuration = d3.max(buckets, (d) => d.durationSeconds) || 1;
    const maxWork = d3.max(buckets, (d) => d.workCapacityKg) || 1;

    const yTime = d3
      .scaleLinear()
      .domain([0, maxDuration])
      .range([innerHeight, 0])
      .nice();

    const yWork = d3
      .scaleLinear()
      .domain([0, maxWork])
      .range([innerHeight, 0])
      .nice();

    // ---------- Axes ---------- //

    const tickCount = getTickCount(grain, buckets.length);
    const tickFormat = getTickFormat(grain);

    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(tickCount)
      .tickFormat(tickFormat)
      .tickSizeOuter(0);

    const xAxisGroup = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // label styling
    xAxisGroup
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", `${theme.colors.grey[600]}`);

    // bar + tick color
    xAxisGroup
      .selectAll("path, line")
      .attr("stroke", `${theme.colors.grey[300]}`);

    // Left Y (time)
    {
      const axisLeft = d3.axisLeft<number>(yTime).ticks(4);
      const yG = g.append("g").call(axisLeft);
      yG.selectAll("path, line").attr("stroke", `${theme.colors.grey[300]}`);

      if (showTime) {
        yG.selectAll("text")
          .text((v) => formatDurationTick(v as number))
          .style("font-size", "11px")
          .style("fill", `${theme.colors.graphPrimary[500]}`)
          .style("font-weight", "500");
      } else {
        yG.selectAll("text").remove();
      }
    }

    // Right Y (work capacity)
    {
      const axisRight = d3.axisRight<number>(yWork).ticks(4);
      const yG = g
        .append("g")
        .attr("transform", `translate(${innerWidth},0)`)
        .call(axisRight);
      yG.selectAll("path, line").attr("stroke", `${theme.colors.grey[300]}`);

      if (showWC) {
        yG.selectAll("text")
          .text((v) => formatWorkTick(v as number))
          .style("font-size", "11px")
          .style("fill", `${theme.colors.graphSecondary[500]}`)
          .style("font-weight", "500");
      } else {
        yG.selectAll("text").remove();
      }
    }

    // ---------- Line generators ---------- //
    const lineTime = d3
      .line<WorkoutAggregate>()
      .x((d) => xScale(parseDate(d.periodStart)!))
      .y((d) => yTime(d.durationSeconds))
      .curve(d3.curveLinear);

    const lineWork = d3
      .line<WorkoutAggregate>()
      .x((d) => xScale(parseDate(d.periodStart)!))
      .y((d) => yWork(d.workCapacityKg))
      .curve(d3.curveLinear);

    // Draw lines first
    if (showTime)
      g.append("path")
        .datum(buckets)
        .attr("fill", "none")
        .attr("stroke", `${theme.colors.graphPrimary[500]}`)
        .attr("stroke-width", 2)
        .attr("d", lineTime);

    if (showWC)
      g.append("path")
        .datum(buckets)
        .attr("fill", "none")
        .attr("stroke", `${theme.colors.graphSecondary[500]}`)
        .attr("stroke-width", 2)
        .attr("d", lineWork);

    // ---------- Area fills ---------- //
    // Fill to x-axis
    if (showTime && !showWC) {
      const areaTime = d3
        .area<WorkoutAggregate>()
        .x((d) => xScale(parseDate(d.periodStart)!))
        .y0(innerHeight)
        .y1((d) => yTime(d.durationSeconds))
        .curve(d3.curveLinear);

      g.append("path")
        .datum(buckets)
        .attr("fill", `${theme.colors.graphPrimary[500]}`)
        .attr("fill-opacity", 0.18)
        .attr("stroke", "none")
        .attr("d", areaTime);
    }

    if (!showTime && showWC) {
      const areaWork = d3
        .area<WorkoutAggregate>()
        .x((d) => xScale(parseDate(d.periodStart)!))
        .y0(innerHeight)
        .y1((d) => yWork(d.workCapacityKg))
        .curve(d3.curveLinear);

      g.append("path")
        .datum(buckets)
        .attr("fill", `${theme.colors.graphSecondary[500]}`)
        .attr("fill-opacity", 0.18)
        .attr("stroke", "none")
        .attr("d", areaWork);
    }

    // Both series – fill strictly between curves, color per top line
    if (showTime && showWC) {
      // 1. Original points in screen space
      const pts: ScreenPoint[] = buckets.map((b) => {
        const d = parseDate(b.periodStart)!;
        return {
          x: xScale(d),
          yTime: yTime(b.durationSeconds),
          yWork: yWork(b.workCapacityKg),
        };
      });

      // 2. Insert intersection points between each pair of segments
      const refined: RefinedPoint[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];

        refined.push({ ...a });

        const inter = segmentIntersection(
          a.x,
          a.yTime,
          b.x,
          b.yTime,
          a.x,
          a.yWork,
          b.x,
          b.yWork
        );

        if (inter) {
          refined.push({
            x: inter.x,
            yTime: inter.y,
            yWork: inter.y,
          });
        }
      }
      refined.push({ ...pts[pts.length - 1] });
      refined.sort((a, b) => a.x - b.x);

      // 3. Area generator that always stays between curves
      const betweenArea = d3
        .area<RefinedPoint>()
        .x((d) => d.x)
        .y0((d) => Math.max(d.yTime, d.yWork)) // bottom
        .y1((d) => Math.min(d.yTime, d.yWork)) // top
        .curve(d3.curveLinear);

      // 4. Walk refined points, split into segments with consistent "top" series
      let segment: RefinedPoint[] = [refined[0]];
      let currentTopIsTime = refined[0].yTime < refined[0].yWork;

      for (let i = 1; i < refined.length; i++) {
        const p = refined[i];
        const topIsTime = p.yTime < p.yWork;
        const isIntersection = p.yTime === p.yWork;

        if (!isIntersection && topIsTime !== currentTopIsTime) {
          // flush current
          if (segment.length >= 2) {
            g.append("path")
              .datum(segment)
              .attr("d", betweenArea)
              .attr(
                "fill",
                currentTopIsTime
                  ? `${theme.colors.graphPrimary[500]}`
                  : `${theme.colors.graphSecondary[500]}`
              )
              .attr("fill-opacity", 0.2)
              .attr("stroke", "none");
          }
          // start new from previous + current
          segment = [segment[segment.length - 1], p];
          currentTopIsTime = topIsTime;
        } else {
          segment.push(p);
        }
      }

      // flush last
      if (segment.length >= 2) {
        g.append("path")
          .datum(segment)
          .attr("d", betweenArea)
          .attr(
            "fill",
            currentTopIsTime
              ? `${theme.colors.graphPrimary[500]}`
              : `${theme.colors.graphSecondary[500]}`
          )
          .attr("fill-opacity", 0.2)
          .attr("stroke", "none");
      }

      const greyArea = d3
        .area<RefinedPoint>()
        .x((d) => d.x) // use screen x
        .y0(innerHeight) // x-axis baseline
        .y1((d) => Math.max(d.yTime, d.yWork)) // always the lower of the two lines
        .curve(d3.curveLinear);

      g.append("path")
        .datum(refined) // use refined, not buckets
        .attr("fill", `${theme.colors.grey[300]}`)
        .attr("fill-opacity", 0.35)
        .attr("stroke", "none")
        .attr("d", greyArea);
    }

    // ---------- Glow filters ---------- //
    const defs = svg.append("defs");
    createGlowFilter(defs, "glowTime", "#8FB7A2");
    createGlowFilter(defs, "glowWork", "#C9A38C");

    // ---------- Layer groups ---------- //
    const lineGroup = g.append("g").attr("class", "line-group");
    const dotGroup = g.append("g").attr("class", "dots-group");

    // ---------- Data points ---------- //
    const timePoints = dotGroup
      .selectAll(".time-point")
      .data(showTime ? buckets : [])
      .enter()
      .append("circle")
      .attr("class", "time-point")
      .attr("cx", (d) => xScale(parseDate(d.periodStart)!))
      .attr("cy", (d) => yTime(d.durationSeconds))
      .attr("r", 4)
      .attr("fill", `${theme.colors.white}`)
      .attr("stroke", `${theme.colors.graphPrimary[500]}`)
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (_, d) => handleBucket(d));

    const workPoints = dotGroup
      .selectAll(".work-point")
      .data(showWC ? buckets : [])
      .enter()
      .append("circle")
      .attr("class", "work-point")
      .attr("cx", (d) => xScale(parseDate(d.periodStart)!))
      .attr("cy", (d) => yWork(d.workCapacityKg))
      .attr("r", 4)
      .attr("fill", `${theme.colors.white}`)
      .attr("stroke", `${theme.colors.graphSecondary[500]}`)
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (_, d) => handleBucket(d));

    // ---------- Active selection visuals ---------- //
    const updateActiveVisuals = () => {
      timePoints
        .attr("fill", `${theme.colors.white}`)
        .attr("r", 4)
        .attr("filter", null);
      workPoints
        .attr("fill", `${theme.colors.white}`)
        .attr("r", 4)
        .attr("filter", null);
      g.selectAll(".selected-line-group").remove();

      if (!bucket) return;

      const xPos = xScale(parseDate(bucket.periodStart)!);
      let yTop: number | null = null;

      if (showTime && showWC) {
        yTop =
          yTime(bucket.durationSeconds) < yWork(bucket.workCapacityKg)
            ? yTime(bucket.durationSeconds)
            : yWork(bucket.workCapacityKg);
      } else if (showTime) {
        yTop = yTime(bucket.durationSeconds);
      } else if (showWC) {
        yTop = yWork(bucket.workCapacityKg);
      }

      const yBottom = innerHeight;

      const barLayer = lineGroup
        .append("g")
        .attr("class", "selected-line-group");

      if (yTop !== null) {
        barLayer
          .append("line")
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", yTop + 8)
          .attr("y2", yBottom)
          .attr("stroke", "#A0AEC6")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "4 4")
          .attr("opacity", 0.9);
      }

      if (showTime) {
        dotGroup
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", yTime(bucket.durationSeconds))
          .attr("r", 8)
          .attr("fill", `${theme.colors.graphPrimary[500]}`)
          .attr("filter", "url(#glowTime)");
      }

      if (showWC) {
        dotGroup
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", yWork(bucket.workCapacityKg))
          .attr("r", 8)
          .attr("fill", `${theme.colors.graphSecondary[500]}`)
          .attr("filter", "url(#glowWork)");
      }
    };

    updateActiveVisuals();

    // ---------- Click -> closest bucket ---------- //
    const clickHandler = (event: any) => {
      const [mouseX] = d3.pointer(event, g.node()!);
      const closestBucket = buckets.reduce(
        (closest: WorkoutAggregate | null, b) => {
          const xPos = xScale(parseDate(b.periodStart)!);
          if (!closest) return b;
          const closestX = xScale(parseDate(closest.periodStart)!);
          return Math.abs(mouseX - xPos) < Math.abs(mouseX - closestX)
            ? b
            : closest;
        },
        null as WorkoutAggregate | null
      );
      if (closestBucket) handleBucket(closestBucket);
    };

    g.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", clickHandler);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [workoutTrends, showTime, showWC, handleBucket, bucket, grain]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 0,
      }}
    >
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
