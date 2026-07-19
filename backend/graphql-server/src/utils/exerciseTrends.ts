import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";

dayjs.extend(isoWeek);

export type ExercisesForTrend = {
  title: string;
  weight: number;
  weightUnit: string;
  sets: number;
  reps: number;
  multiplier: number;
  date: string;
  workoutUid: string;
  workCapacityKg: number;
};

type BucketPeriod = "day" | "isoWeek" | "month" | "year";

function generateExerciseBuckets(
  exercises: Array<ExercisesForTrend>,
  period: BucketPeriod
) {
  const grouped = new Map<string, ExercisesForTrend[]>();

  for (const exercise of exercises) {
    const periodStart = dayjs(exercise.date)
      .startOf(period)
      .format("YYYY-MM-DD");

    const existing = grouped.get(periodStart) ?? [];
    existing.push(exercise);
    grouped.set(periodStart, existing);
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([periodStart, rows]) => {
      const periodEnd = dayjs(periodStart).endOf(period).format("YYYY-MM-DD");

      const componentMap = new Map<
        string,
        {
          weight: number;
          weightUnit: string;
          workCapacityKg: number;
        }
      >();

      let totalWorkCapacityKg = 0;

      for (const row of rows) {
        totalWorkCapacityKg += row.workCapacityKg;

        const key = `${row.weight}::${row.weightUnit}`;

        const existing = componentMap.get(key);
        if (existing) {
          existing.workCapacityKg += row.workCapacityKg;
        } else {
          componentMap.set(key, {
            weight: row.weight,
            weightUnit: row.weightUnit,
            workCapacityKg: row.workCapacityKg,
          });
        }
      }

      return {
        periodStart,
        periodEnd,
        totalWorkCapacityKg,
        // Heaviest kettlebell always returned first
        workCapacityComponents: [...componentMap.values()].sort((a, b) => {
          const aKg = a.weightUnit === "lb" ? a.weight * 0.45359237 : a.weight;
          const bKg = b.weightUnit === "lb" ? b.weight * 0.45359237 : b.weight;

          return bKg - aKg;
        }),
      };
    });
}

export function generateDailyExerciseBuckets(
  exercises: Array<ExercisesForTrend>
) {
  return generateExerciseBuckets(exercises, "day");
}

export function generateWeeklyISOBuckets(exercises: Array<ExercisesForTrend>) {
  return generateExerciseBuckets(exercises, "isoWeek");
}

export function generateMonthlyExerciseBuckets(
  exercises: Array<ExercisesForTrend>
) {
  return generateExerciseBuckets(exercises, "month");
}

export function generateYearlyExerciseBuckets(
  exercises: Array<ExercisesForTrend>
) {
  return generateExerciseBuckets(exercises, "year");
}
