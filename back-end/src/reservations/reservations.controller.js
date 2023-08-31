const reservationsService = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.status(200).json({
    data: reservationsService.list,
  });
}

module.exports = {
  list,
};