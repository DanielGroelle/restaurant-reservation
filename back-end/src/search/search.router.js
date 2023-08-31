/**
 * Defines the router for searching resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./search.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;