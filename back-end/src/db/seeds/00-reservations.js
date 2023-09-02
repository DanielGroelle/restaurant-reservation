const fs = require("fs");

const reservationJSON = fs.readFileSync("./src/db/seeds/00-reservations.json");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserts seed entries
      return knex("reservations").insert(JSON.parse(reservationJSON));
    });
};