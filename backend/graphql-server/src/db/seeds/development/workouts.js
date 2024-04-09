export async function seed(knex) {
  const usersUids = (await knex("users")).map((user) => user.uid);

  // Deletes ALL existing entries
  await knex("workouts").del();
  await knex("workouts").insert([
    {
      user_uid: usersUids[0],
      comment: "John's first workout",
    },
    {
      user_uid: usersUids[0],
      comment: "John's second workout",
    },
    {
      user_uid: usersUids[1],
      comment: "Jane's workout",
    },
    {
      user_uid: usersUids[2],
      comment: "Robert's workout",
    },
    {
      user_uid: usersUids[3],
      comment: "Ada's first workout",
    },
    {
      user_uid: usersUids[3],
      comment: "Ada's second workout",
    },
  ]);
}
