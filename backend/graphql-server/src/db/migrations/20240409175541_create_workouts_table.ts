export async function up(knex: {
  schema: { createTable: (arg0: string, arg1: (table: any) => void) => any };
  raw: (arg0: string) => any;
  fn: { now: () => any };
}) {
  await knex.schema.createTable("workouts", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("userUid").notNullable().references("uid").inTable("users");
    table.string("date").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.integer("elapsedSeconds");
    table.string("comment", 512);
  });
}

export async function down(knex: {
  schema: { dropTableIfExists: (arg0: string) => any };
}) {
  await knex.schema.dropTableIfExists("workouts");
}
