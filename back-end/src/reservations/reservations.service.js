const knex = require("../db/connection");

async function list() {
    return knex("reservations")
        .select("*");
}

async function create(reservationData) {
    return knex("reservations")
        .insert(reservationData, ["*"]);
}

async function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({"reservation_id": Number(reservationId)})
        .then((data)=>data[0]);
}

async function destroy(reservationId) {
    return knex("reservations")
        .where({"reservation_id": Number(reservationId)})
        .del();
}

async function update(reservationId, reservationData) {
    await knex("reservations")
        .where({"reservation_id": Number(reservationId)})
        .update(reservationData, ["*"]);

    return read(reservationId);
}

module.exports = {
    list,
    create,
    read,
    destroy,
    update
};