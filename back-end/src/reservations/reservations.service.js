const knex = require("../db/connection");

/**
 * List API
 * @returns array of reservations
 */
async function list() {
    return knex("reservations")
        .select("*");
}

/**
 * Create API
 * @param {object} reservationData 
 * @returns created reservation
 */
async function create(reservationData) {
    return knex("reservations")
        .insert(reservationData, ["*"])
        .then((data)=>data[0]);
}

/**
 * Read API
 * @param {string} reservationId 
 * @returns found reservation
 */
async function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": Number(reservationId)})
        .then((data)=>data[0]);
}

/**
 * Update API
 * @param {string} reservationId 
 * @param {object} reservationData 
 * @returns updated reservation
 */
async function update(reservationId, reservationData) {
    await knex("reservations")
    .where({"reservation_id": Number(reservationId)})
    .update(reservationData, ["*"]);
    
    return read(reservationId);
}

/**
 * Destroy API
 * @param {string} reservationId 
 */
async function destroy(reservationId) {
    return knex("reservations")
        .where({"reservation_id": Number(reservationId)})
        .del();
}

module.exports = {
    list,
    create,
    read,
    update,
    destroy
};