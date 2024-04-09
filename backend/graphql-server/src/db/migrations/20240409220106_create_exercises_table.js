export async function up(knex) {
  await knex.schema.createTable("exercises", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("workout_uid")
      .notNullable()
      .references("uid")
      .inTable("workouts");
    table.string("title", 255).notNullable();
    table.float("weight");
    table.string("weight_unit", 255);
    table.integer("sets");
    table.integer("reps");
    table.string("reps_display", 255);
    table.string("comment", 512);
    table.timestamp("start_time").defaultTo(knex.fn.now());
    table.timestamp("end_time").defaultTo(null);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("exercises");
}
