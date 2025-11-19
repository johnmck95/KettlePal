export async function up(knex) {
  await knex.schema.alterTable("users", function (table) {
    table.float("bodyWeight").notNullable().defaultTo(0);
    table.enu("bodyWeightUnit", ["lb", "kg"]).notNullable().defaultTo("kg");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("users", function (table) {
    table.dropColumn("bodyWeight");
    table.dropColumn("bodyWeightUnit");
  });
}
