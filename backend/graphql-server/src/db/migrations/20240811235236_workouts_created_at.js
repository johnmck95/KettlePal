export async function up(knex) {
  await knex.schema.table("workouts", (table) => {
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex) {
  await knex.schema.table("workouts", (table) => {
    table.dropColumn("createdAt");
  });
}
