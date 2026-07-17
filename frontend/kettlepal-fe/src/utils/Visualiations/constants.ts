import theme from "../../Constants/theme";
import { WorkCapacityComponent } from "../../generated/frontend-types";

export const STANDARD_KETTLEBELL_COLOURS: Record<string, string> = {
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

export const LB_TO_KG = 0.45359237;

export const weightLabel = (component: WorkCapacityComponent): string =>
  `${component.weight} ${component.weightUnit}`;

export function createGlowFilter(
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
