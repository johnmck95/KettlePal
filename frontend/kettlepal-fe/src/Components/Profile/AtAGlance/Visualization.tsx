import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { AtAGlanceQuery } from "../../../generated/frontend-types";
import theme from "../../../Constants/theme";

type AtAGlanceData = NonNullable<
  NonNullable<NonNullable<AtAGlanceQuery["user"]>["atAGlance"]>["data"]
>;

interface VisualizationProps {
  data: AtAGlanceData;
  period: "Week" | "Month" | "Year" | "Lifetime";
  visualizeField: "Time" | "Work Capacity";
}

export default function Visualization({
  data,
  period,
  visualizeField,
}: VisualizationProps) {
  const MAX_SECONDS = 60 * 60 * 2; // 2 hours
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const visualizeFieldMapping = {
    Time: "elapsedSeconds",
    "Work Capacity": "workCapacityKg",
  };
  const visualizationField =
    (visualizeFieldMapping[visualizeField] as
      | "elapsedSeconds"
      | "workCapacityKg") ?? "elapsedSeconds";

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    /////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Prepare Data & Labels /////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekLabels = data.map((entry, index) => `Week ${index + 1}`);
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const yearLabels = data.map(
      (entry, index) => entry?.dateRange.slice(0, 4) ?? ""
    );

    const largestTimeFromData = data.reduce(
      (max, entry) => Math.max(max, entry?.elapsedSeconds ?? 0),
      0
    );
    const yAxisTitle =
      visualizeField === "Time"
        ? largestTimeFromData > MAX_SECONDS
          ? "Time (hr)"
          : "Time (min)"
        : "Work Capacity (kg)";

    const margin = { top: 20, right: 30, bottom: 35, left: 70 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    const formattedData = data.map((entry, index) => ({
      ...entry,
      startDate: parseDate(entry?.dateRange.split(",")[0] ?? "")!,
      endDate: parseDate(entry?.dateRange.split(",")[1] ?? "")!,
      xAxisLabel:
        period === "Week"
          ? dayLabels[index]
          : period === "Month"
          ? weekLabels[index]
          : period === "Year"
          ? monthLabels[index]
          : yearLabels[index],
    }));

    const yAxisValue = (entry: (typeof formattedData)[0]) => {
      return visualizeField === "Time"
        ? largestTimeFromData > MAX_SECONDS
          ? (entry[visualizationField] ?? 0) / 3600 // # of hours
          : (entry[visualizationField] ?? 0) / 60 // # of minutes
        : entry[visualizationField] ?? 0;
    };

    const xAxisLabels =
      period === "Week"
        ? dayLabels
        : period === "Month"
        ? weekLabels
        : period === "Year"
        ? monthLabels
        : yearLabels;
    /////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// D3 Visualization Code /////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////

    const svg = d3.select(svgRef.current);
    // Clear previous content
    svg.selectAll("*").remove();
    const svgGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand().domain(xAxisLabels).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([
        0,
        (d3.max(formattedData, (entry) => yAxisValue(entry)) as number) * 1.1,
      ])
      .range([height, 0]);

    // Create Y axis
    svgGroup.append("g").call(d3.axisLeft(y));

    // Add Y axis label
    svgGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yAxisTitle);

    // Create line
    const line = d3
      .line<(typeof formattedData)[0]>()
      .x((entry) => x(entry.xAxisLabel)! + x.bandwidth() / 2)
      .y((entry) => y(yAxisValue(entry)));

    // Create area
    const area = d3
      .area<(typeof formattedData)[0]>()
      .x((entry) => x(entry.xAxisLabel)! + x.bandwidth() / 2)
      .y0(height)
      .y1((entry) => y(yAxisValue(entry)));

    // Creates a "noisy texture" to color the area under the curve with a canvas element & color interpolator
    function createTexture() {
      // Create a canvas element to generate noise
      const canvas = document.createElement("canvas");
      const context: any = canvas.getContext("2d");
      const size = 100;
      canvas.width = size;
      canvas.height = size;

      // Create a color interpolator to generate noisey texture under the curve
      const colorInterpolator = d3.interpolateRgb(
        theme.colors.grey[300],
        theme.colors.feldgrau[100]
      );

      // Generate noise
      const imageData = context.createImageData(size, size);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const randomValue = Math.random(); // Random value between 0 and 1
        const color = d3.rgb(colorInterpolator(randomValue));
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
        imageData.data[i + 3] = 40; // Low alpha for subtlety
      }
      context.putImageData(imageData, 0, 0);

      // Create pattern in SVG
      const defs = svgGroup.append("defs");
      const pattern = defs
        .append("pattern")
        .attr("id", "noiseTexture")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", size)
        .attr("height", size);
      pattern
        .append("image")
        .attr("xlink:href", canvas.toDataURL())
        .attr("width", size)
        .attr("height", size);
    }

    // Add patterned area
    createTexture();
    svgGroup
      .append("path")
      .datum(formattedData)
      .attr("fill", "url(#noiseTexture)")
      .attr("d", area);

    // Add line
    svgGroup
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", theme.colors.feldgrau[300])
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    svgGroup
      .selectAll(".dot")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (entry) => x(entry.xAxisLabel)! + x.bandwidth() / 2)
      .attr("cy", (entry) => y(yAxisValue(entry)))
      .attr("r", 4)
      .attr("fill", theme.colors.feldgrau[500]);

    // Add x axis
    svgGroup
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add y axis
    svgGroup.append("g").call(d3.axisLeft(y));

    // Create a tooltip
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("padding", "10px")
      .style("background", "#333")
      .style("color", "#fff")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  }, [data, visualizeField, visualizationField, period, MAX_SECONDS]);

  return (
    <svg ref={svgRef} style={{ width: "100%", minHeight: "400px" }}>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          padding: "10px",
          opacity: 0,
          zIndex: 10,
        }}
      />
    </svg>
  );
}
