export async function up(knex: {
  schema: { alterTable: (arg0: string, arg1: (table: any) => void) => any };
}) {
  await knex.schema.alterTable("users", function (table) {
    table.float("bodyWeight").notNullable().defaultTo(0);
    table.string("bodyWeightUnit", 255).notNullable().defaultTo("kg");
  });
}

export async function down(knex: {
  schema: { alterTable: (arg0: string, arg1: (table: any) => void) => any };
}) {
  await knex.schema.alterTable("users", function (table) {
    table.dropColumn("bodyWeight");
    table.dropColumn("bodyWeightUnit");
  });
}
