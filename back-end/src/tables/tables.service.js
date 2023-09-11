const knex = require("../db/connection");

/**
 * List API
 * @returns array of tables
 */
async function list() {
    return knex("tables")
        .select("*");
}

/**
 * Create API
 * @param {object} tableData
 * @returns created table
 */
async function create(tableData) {
    return knex("tables")
        .insert(tableData, ["*"])
        .then((data)=>data[0]);
}

/**
 * Read API
 * @param {string} tableId 
 * @returns found table
 */
async function read(tableId) {
    return knex("tables")
        .select("*")
        .where({"table_id": Number(tableId)})
        .then((data)=>data[0]);
}

/**
 * Update API
 * @param {string} tableId 
 * @param {object} tableData 
 * @returns updated table
 */
async function update(tableId, tableData) {
    await knex("tables")
    .where({"table_id": Number(tableId)})
    .update(tableData, ["*"]);
    
    return read(tableId);
}

/**
 * Destroy API
 * @param {string} tableId 
 */
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