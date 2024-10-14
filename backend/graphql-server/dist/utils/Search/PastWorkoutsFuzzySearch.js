export default async function getFuzzyWorkoutSearchResults({ searchQuery, userUid, knexInstance, limit, offset, }) {
    const user = await knexInstance("users").where("uid", userUid).first();
    const query = knexInstance("workouts")
        .select("workouts.*")
        .leftJoin("exercises", "workouts.uid", "exercises.workoutUid")
        .where("workouts.userUid", userUid)
        .groupBy("workouts.uid")
        .whereRaw("workouts.comment ILIKE ?", [`%${searchQuery}%`])
        .orWhereRaw("exercises.title ILIKE ?", [`%${searchQuery}%`])
        .orWhereRaw("exercises.comment ILIKE ?", [`%${searchQuery}%`])
        .orderByRaw("date::date DESC")
        .offset(offset)
        .limit(limit);
    const workouts = await query;
    const workoutWithExercises = [];
    //  Fetch exercises for each workout
    for (let workout of workouts) {
        const exercises = await knexInstance("exercises").where("workoutUid", workout.uid);
        workoutWithExercises.push({ ...workout, exercises });
    }
    const res = {
        ...user,
        workoutWithExercises,
    };
    return res;
}
