export async function seed(knex) {
  await knex("users").del();
  await knex("users").insert([
    {
      firstName: "John",
      lastName: "Doe",
      email: "JoeyDoey@email.com",
      password: "hashme",
      isAuthorized: false,
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "JaneDoe@email.com",
      password: "hashme",
      isAuthorized: false,
    },
    {
      firstName: "Robert",
      lastName: "Lebowsky",
      email: "RobLeb@email.com",
      password: "hashme",
      isAuthorized: false,
    },
    {
      firstName: "Ada",
      lastName: "Funk",
      email: "AdaFunk@email.com",
      password: "hashme",
      isAuthorized: false,
    },
  ]);
}
