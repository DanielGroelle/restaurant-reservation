exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
      table.increments("reservation_id").primary();
      table.string("first_name",255).notNullable();
      table.string("last_name", 255); //can be null since form doesnt require a last name
      table.string("mobile_number").notNullable();
      table.date("reservation_date").notNullable();
      table.time("reservation_time").notNullable();
      table.integer("people").notNullable();
      table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};