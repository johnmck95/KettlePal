export async function up(knex) {
  await knex.schema.alterTable("users", function (table) {
    table.integer("tokenCount").defaultTo(0).notNullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("users", function (table) {
    table.dropColumn("tokenCount");
  });
}
