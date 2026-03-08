import { CreateOrUpdateWorkoutState } from "../../Hooks/HookHelpers/validation";

export function buildEmomSchedule(
  exercises: CreateOrUpdateWorkoutState["exercises"]
) {
  // Clone with remaining rounds (usually sets)
  const pool = exercises.map((e) => ({
    exercise: e,
    remaining: Number(e.sets?.value) ?? 0,
  }));

  const schedule: typeof exercises = [];

  let index = 0;

  while (pool.some((p) => p.remaining > 0)) {
    const current = pool[index % pool.length];

    if (current.remaining > 0) {
      schedule.push(current.exercise);
      current.remaining -= 1;
    }

    index += 1;
  }

  return schedule;
}
