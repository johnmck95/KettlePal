export async function up(knex: {
  schema: { alterTable: (arg0: string, arg1: (table: any) => void) => any };
}) {
  await knex.schema.alterTable("exercises", function (table) {
    table.float("multiplier").notNullable().defaultTo(1.0);
  });
}

export async function down(knex: {
  schema: { alterTable: (arg0: string, arg1: (table: any) => void) => any };
}) {
  await knex.schema.alterTable("exercises", function (table) {
    table.dropColumn("multiplier");
  });
}
