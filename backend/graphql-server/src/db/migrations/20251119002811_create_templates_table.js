export async function up(knex) {
  await knex.schema.createTable("templates", function (table) {
    table.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("userUid").notNullable().references("uid").inTable("users");
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    table.string("title", 255).notNullable();
    table.string("weightUnit", 255);
    table.float("multiplier").defaultTo(0.0);
    table.string("repsDisplay", 255);
    table.integer("index").notNullable().defaultTo(0);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("templates");
}
