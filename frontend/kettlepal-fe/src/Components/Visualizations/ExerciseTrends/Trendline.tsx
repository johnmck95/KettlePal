import { ExerciseAggregate } from "../../../generated/frontend-types";

interface Props {
  buckets: ExerciseAggregate[];
  setActiveBucket: (activeBucket: ExerciseAggregate | null) => void;
}

export default function StackedBarChart({ buckets, setActiveBucket }: Props) {
  return <h1>TODO</h1>;
}
