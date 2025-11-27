export async function up(knex: {
  schema: { alterTable: (arg0: string, arg1: (table: any) => void) => any };
}) {
  await knex.schema.alterTable("users", function (table) {
    table.integer("tokenCount").defaultTo(0).notNullable();
  });
}

export async function down(knex: {
  schema: { alterTable: (arg0: string, arg1: (table: any) => void) => any };
}) {
  await knex.schema.alterTable("users", function (table) {
    table.dropColumn("tokenCount");
  });
}
