import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { AtAGlanceQuery } from "../../../../generated/frontend-types";
import theme from "../../../../Constants/theme";
import Tooltip from "./Tooltip";
import { useMediaQuery } from "@chakra-ui/react";

type AtAGlanceData = NonNullable<
  NonNullable<NonNullable<AtAGlanceQuery["user"]>["atAGlance"]>["data"]
>;

interface GraphProps {
  data: AtAGlanceData;
  period: "Week" | "Month" | "Year" | "Lifetime";
  visualizeField: "Time" | "Work Capacity";
}

export type FormattedData = {
  startDate: Date;
  endDate: Date;
  xAxisLabel: string;
  __typename?: "AtAGlanceData" | undefined;
  dateRange?: string | undefined;
  elapsedSeconds?: number | undefined;
  workCapacityKg?: number | undefined;
}[];

export default function Graph({ data, period, visualizeField }: GraphProps) {
  const [tooltipContent, setTooltipContent] = React.useState<
    FormattedData[0] | null
  >(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const MAX_SECONDS = 60 * 60 * 2; // 2 hours
  const svgRef = useRef<SVGSVGElement>(null);
  const visualizeFieldMapping = {
    Time: "elapsedSeconds",
    "Work Capacity": "workCapacityKg",
  };
  const visualizationField =
    (visualizeFieldMapping[visualizeField] as
      | "elapsedSeconds"
      | "workCapacityKg") ?? "elapsedSeconds";

  const [isSmallScreen] = useMediaQuery("(max-width: 1200px)");

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    ///////////////////////////// Prepare Data & Labels /////////////////////////////////////

    const dayLabels = data.map((entry, i) => {
      const date = new Date(entry?.dateRange.split(",")[0] + ":12:00" ?? "");
      return date.toLocaleDateString(
        "en-US",
        isSmallScreen
          ? data.length > 7
            ? { day: "numeric" }
            : { weekday: "short" }
          : data.length > 7
          ? { month: "short", day: "numeric" }
          : { weekday: "short", month: "short", day: "numeric" }
      );
    });

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
    const yearLabels = data.map((entry) => entry?.dateRange.slice(0, 4) ?? "");

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
    const formattedData: FormattedData = data.map((entry, index) => ({
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

    ///////////////////////////// D3 Visualization Code /////////////////////////////////////

    const svg = d3.select(svgRef.current);
    // Clear previous content
    svg.selectAll("*").remove();
    const svgGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand().domain(xAxisLabels).range([0, width]);

    const allZero = formattedData.every((entry) => yAxisValue(entry) === 0);
    const y = d3
      .scaleLinear()
      .domain([
        0,
        allZero
          ? 1
          : (d3.max(formattedData, (entry) => yAxisValue(entry)) as number) *
            1.1,
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

    // Colors dots relative to the current date
    function getDotColour(entry: (typeof formattedData)[0]) {
      const today = new Date();
      const pointStart = new Date(entry.startDate);
      pointStart.setHours(0, 0, 0, 0);
      const pointEnd = new Date(entry.endDate);
      pointEnd.setHours(23, 59, 59, 999);

      switch (period) {
        case "Week":
        default:
          return today.getTime() >= pointStart.getTime() &&
            today.getTime() <= pointEnd.getTime()
            ? theme.colors.lion[700] // today
            : today.getTime() < pointEnd.getTime()
            ? theme.colors.grey[300] // future
            : theme.colors.feldgrau[500]; // past

        case "Month":
          const currentDay = today.getDay();
          const diff =
            today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when current day is Sunday
          const monday = new Date(today.setDate(diff));
          monday.setHours(0, 0, 0, 0);
          const sunday = new Date(today.setDate(diff + 6));
          sunday.setHours(23, 59, 59, 999);

          return (pointEnd.getTime() >= monday.getTime() &&
            pointEnd.getTime() <= sunday.getTime()) ||
            (pointStart.getTime() <= sunday.getTime() &&
              pointStart.getTime() >= monday.getTime())
            ? theme.colors.lion[700] // this week
            : pointEnd.getTime() < monday.getTime()
            ? theme.colors.feldgrau[500] // past week
            : theme.colors.grey[300]; // future week

        case "Year":
        case "Lifetime":
          return today.getTime() >= pointStart.getTime() &&
            today.getTime() <= pointEnd.getTime()
            ? theme.colors.lion[700] // today
            : today.getTime() < pointStart.getTime()
            ? theme.colors.grey[300] // future
            : theme.colors.feldgrau[500]; // past
      }
    }

    // Add dots, register tooltip
    svgGroup
      .selectAll(".dot")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (entry) => x(entry.xAxisLabel)! + x.bandwidth() / 2)
      .attr("cy", (entry) => y(yAxisValue(entry)))
      .attr("r", 8)
      .attr("fill", (entry) => getDotColour(entry))
      .on("mouseover", function (event, entry: FormattedData[0]) {
        // Highlight dot on hover
        d3.select(this).attr("fill", theme.colors.black);

        // Y coordinates are inverted in D3
        const [mouseX, mouseY] = d3.pointer(event);

        const graphWidth = svgRef.current?.clientWidth ?? 0;
        const graphHeight = svgRef.current?.clientHeight ?? 0;
        const tooltipWidth = 260 - 32; // -32px for the tooltip padding
        const tooltipHeight = 125 - 32; // -32px for the tooltip padding

        let setXTTooltipTo;
        let setYTTooltipTo;
        // always place the tooltip to the far graph edges on small screens
        if (graphWidth <= 600) {
          setXTTooltipTo =
            mouseX >= graphWidth / 2 // mouse is in the right half, place tooltip far right
              ? graphWidth - tooltipWidth - 50
              : 75;
        } else {
          setXTTooltipTo =
            mouseX >= graphWidth / 2 // mouse is in the right half, place tooltip to the left of the dot
              ? mouseX - tooltipWidth + 38
              : mouseX + 68;
        }
        setYTTooltipTo =
          graphHeight - mouseY >= graphHeight / 2
            ? mouseY + 35
            : mouseY - tooltipHeight - 35;

        setTooltipPosition({ x: setXTTooltipTo, y: setYTTooltipTo });
        setTooltipContent(entry);
      })
      .on("mouseout", function (event, entry: FormattedData[0]) {
        d3.select(this as any).attr("fill", getDotColour(entry));
        setTooltipContent(null);
      });

    // Add x axis
    svgGroup
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add y axis
    svgGroup.append("g").call(d3.axisLeft(y));
  }, [
    data,
    visualizeField,
    visualizationField,
    period,
    MAX_SECONDS,
    isSmallScreen,
  ]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} style={{ width: "100%", minHeight: "400px" }} />
      {tooltipContent && (
        <Tooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </div>
  );
}
