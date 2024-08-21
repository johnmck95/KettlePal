export async function up(knex) {
  await knex.schema.createTable("workouts", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("userUid").notNullable().references("uid").inTable("users");
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("startTime").defaultTo(knex.fn.now());
    table.timestamp("endTime").defaultTo(knex.fn.now());
    table.string("comment", 512);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("workouts");
}
