export function formatReps(
  reps: number,
  repsDisplay: string // l/r | std | (1,2) | (1,2,3) | (1,2,3,4) | (1,2,3,4,5)
): string {
  switch (repsDisplay.toLowerCase()) {
    case "standard":
    case "std":
      return reps.toString();

    case "l/r":
      if (reps % 2 === 0) {
        return `${reps / 2}/${reps / 2}`;
      } else {
        console.log(
          `formatReps detected an odd number of reps for an l/r set. Exiting gracefully..`
        );
        return "----";
      }

    case "(1,2)":
      if (reps !== 6) {
        console.log(
          `formatReps detected a (1,2) ladder without 6 total reps. Exiting gracefully..`
        );
        return "----";
      } else {
        return repsDisplay;
      }
    case "(1,2,3)":
      if (reps !== 12) {
        console.log(
          `formatReps detected a (1,2,3) ladder without 12 total reps. Exiting gracefully..`
        );
        return "----";
      } else {
        return repsDisplay;
      }
    case "(1,2,3,4)":
      if (reps !== 20) {
        console.log(
          `formatReps detected a (1,2,3,4) ladder without 20 total reps. Exiting gracefully..`
        );
        return "----";
      } else {
        return repsDisplay;
      }
    case "(1,2,3,4,5)":
      if (reps !== 30) {
        console.log(
          `formatReps detected a (1,2,3,4,5) ladder without 30 total reps. Exiting gracefully..`
        );
        return "----";
      } else {
        return repsDisplay;
      }

    default:
      console.log(
        `formatReps was not able to recognice the ${repsDisplay} string. Exiting gracefully..`
      );
      return "----";
  }
}
