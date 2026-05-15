export async function seed(knex: any) {
  const usersUids = (await knex("users")).map((user: { uid: any }) => user.uid);

  await knex("workouts").del();
  await knex("workouts").insert([
    {
      userUid: usersUids[0],
      comment: "John's first workout",
    },
    {
      userUid: usersUids[0],
      comment: "John's second workout",
    },
    {
      userUid: usersUids[1],
      comment: "Jane's workout",
    },
    {
      userUid: usersUids[2],
      comment: "Robert's workout",
    },
    {
      userUid: usersUids[3],
      comment: "Ada's first workout",
    },
    {
      userUid: usersUids[3],
      comment: "Ada's second workout",
    },
  ]);
}
