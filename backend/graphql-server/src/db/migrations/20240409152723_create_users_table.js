export async function up(knex) {
  await knex.schema.createTable("users", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("password", 255).notNullable();
    table.boolean("is_authorized").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
}
