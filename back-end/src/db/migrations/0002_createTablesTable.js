exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.string("table_name",255).notNullable();
        table.integer("capacity").notNullable();
        table.integer("reservation_id").defaultTo(null);
        table.foreign("reservation_id").references("reservations.reservation_id");
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("tables");
};