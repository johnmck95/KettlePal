export async function up(knex: {
  schema: { createTable: (arg0: string, arg1: (table: any) => void) => any };
  raw: (arg0: string) => any;
  fn: { now: () => any };
}) {
  await knex.schema.createTable("exercises", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("workoutUid")
      .notNullable()
      .references("uid")
      .inTable("workouts");
    table.string("title", 255).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.float("weight");
    table.string("weightUnit", 255);
    table.integer("sets");
    table.integer("reps");
    table.string("repsDisplay", 255);
    table.integer("elapsedSeconds");
    table.string("comment", 512);
  });
}

export async function down(knex: {
  schema: { dropTableIfExists: (arg0: string) => any };
}) {
  await knex.schema.dropTableIfExists("exercises");
}
