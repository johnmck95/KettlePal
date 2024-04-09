export async function up(knex) {
  await knex.schema.createTable("workouts", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("user_uid").notNullable().references("uid").inTable("users");
    table.timestamp("start_time").defaultTo(knex.fn.now());
    table.timestamp("end_time").defaultTo(null);
    table.string("comment", 512);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("workouts");
}
