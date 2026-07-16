import { useEffect, useRef } from "react";
import { ExerciseAggregate } from "../../generated/frontend-types";
import * as d3 from "d3";

interface Props {
  buckets: ExerciseAggregate[];
}

export default function ExerciseTrendsStackedBarChart({ buckets }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !buckets) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth || 600;
    const height = svgEl.clientHeight || 400;
    const margin = { top: 16, right: 60, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    return () => {
      svg.selectAll("*").remove();
    };
  }, [buckets]);

  console.log(buckets);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 0,
        border: "2px solid black",
      }}
    >
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
