const searchService = require("./search.service");

/**
 * List handler for search for resources
 */
async function list(req, res) {
  res.json({
    data: searchService.list,
  });
}

module.exports = {
  list,
};