export async function up(knex) {
  await knex.schema.createTable("users", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("firstName", 255).notNullable();
    table.string("lastName", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("password", 255).notNullable();
    table.boolean("isAuthorized").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.integer("tokenCount").defaultTo(0).notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
}
