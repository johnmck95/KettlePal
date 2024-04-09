export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      first_name: "John",
      last_name: "Doe",
      email: "JoeyDoey@email.com",
      password: "hashme",
      is_authorized: false,
    },
    {
      first_name: "Jane",
      last_name: "Doe",
      email: "JaneDoe@email.com",
      password: "hashme",
      is_authorized: false,
    },
    {
      first_name: "Robert",
      last_name: "Lebowsky",
      email: "RobLeb@email.com",
      password: "hashme",
      is_authorized: false,
    },
    {
      first_name: "Ada",
      last_name: "Funk",
      email: "AdaFunk@email.com",
      password: "hashme",
      is_authorized: false,
    },
  ]);
}
