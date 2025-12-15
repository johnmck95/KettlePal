export async function up(knex: {
  schema: { createTable: (arg0: string, arg1: (table: any) => void) => any };
  raw: (arg0: string) => any;
  fn: { now: () => any };
}) {
  await knex.schema.createTable("templates", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("userUid").notNullable().references("uid").inTable("users");
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.string("title", 255).notNullable();
    table.string("weightUnit", 255);
    table.float("multiplier").notNullable().defaultTo(1.0);
    table.string("repsDisplay", 255);
    table.integer("index").notNullable().defaultTo(0);
    table.boolean("isBodyWeight").notNullable().defaultTo(false);
  });
}

export async function down(knex: {
  schema: { dropTableIfExists: (arg0: string) => any };
}) {
  await knex.schema.dropTableIfExists("templates");
}
