import knex from "knex";

export default async function getFuzzyWorkoutSearchResults({
  searchQuery,
  userUid,
  knexInstance,
  limit,
  offset,
}: {
  searchQuery: string;
  userUid: string;
  knexInstance: any;
  limit: number;
  offset: number;
}) {
  const user = await knexInstance("users").where("uid", userUid).first();

  const query = knexInstance("workouts")
    .select("workouts.*")
    .leftJoin("exercises", "workouts.uid", "exercises.workoutUid")
    .where("workouts.userUid", userUid)
    .andWhere(function () {
      this.whereRaw("LOWER(workouts.comment) LIKE ?", [
        `%${searchQuery.toLowerCase()}%`,
      ])
        .orWhereRaw("LOWER(exercises.title) LIKE ?", [
          `%${searchQuery.toLowerCase()}%`,
        ])
        .orWhereRaw("LOWER(exercises.comment) LIKE ?", [
          `%${searchQuery.toLowerCase()}%`,
        ]);
    })
    .groupBy("workouts.uid")
    .orderByRaw("date::date DESC")
    .offset(offset)
    .limit(limit);

  const workouts = await query;
  const workoutWithExercises = [];

  //  Fetch exercises for each workout
  for (let workout of workouts) {
    const exercises = await knexInstance("exercises").where(
      "workoutUid",
      workout.uid
    );
    workoutWithExercises.push({ ...workout, exercises });
  }

  const res = {
    ...user,
    workoutWithExercises,
  };

  return res;
}
