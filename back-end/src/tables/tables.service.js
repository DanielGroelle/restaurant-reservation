const knex = require("../db/connection");

async function list() {
    return knex("tables")
        .select("*");
}

async function create(tableData) {
    return knex("tables")
        .insert(tableData, ["*"]);
}

async function read(tableId) {
    return knex("tables")
        .select("*")
        .where({"table_id": Number(tableId)})
        .then((data)=>data[0]);
}

async function update(tableId, tableData) {
    await knex("tables")
    .where({"table_id": Number(tableId)})
    .update(tableData, ["*"]);
    
    return read(tableId);
}

async function destroy(tableId) {
    return knex("tables")
        .where({"table_id": Number(tableId)})
        .del();
}

module.exports = {
    list,
    create,
    read,
    update,
    destroy
};