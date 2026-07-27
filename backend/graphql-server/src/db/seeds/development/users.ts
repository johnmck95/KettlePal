export async function seed(knex: any) {
  const guestExists = await knex("users")
    .where({ email: "test_account@gmail.com" })
    .first();

  if (!guestExists) {
    await knex("users").insert([
      {
        firstName: "Guest",
        lastName: "User",
        email: "test_account@gmail.com",
        password:
          "$2b$12$x0HbL/Rg76egNffD/U4grOiNVvz3nDwYfrxeJhIFeP/VJR7bW650K",
        isAuthorized: false,
      },
    ]);
  }
}
