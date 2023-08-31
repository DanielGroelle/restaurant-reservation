const tablesService = require("./tables.service");

/**
 * List handler for tables resources
 */
async function list(req, res) {
  res.json({
    data: tablesService.list,
  });
}

module.exports = {
  list,
};