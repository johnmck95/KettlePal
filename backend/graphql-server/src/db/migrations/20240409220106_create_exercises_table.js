export async function up(knex) {
  await knex.schema.createTable("exercises", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("workoutUid")
      .notNullable()
      .references("uid")
      .inTable("workouts");
    table.string("title", 255).notNullable();
    table.float("weight");
    table.string("weightUnit", 255);
    table.integer("sets");
    table.integer("reps");
    table.string("repsDisplay", 255);
    table.string("comment", 512);
    table.timestamp("startTime").defaultTo(knex.fn.now());
    table.timestamp("endTime").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("exercises");
}
