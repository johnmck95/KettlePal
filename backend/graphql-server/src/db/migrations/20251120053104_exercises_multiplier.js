export async function up(knex) {
  await knex.schema.alterTable("exercises", function (table) {
    table.float("multiplier").notNullable().defaultTo(1.0);
  });
}

export async function down(knex) {
  await knex.schema.alterTable("exercises", function (table) {
    table.dropColumn("multiplier");
  });
}
