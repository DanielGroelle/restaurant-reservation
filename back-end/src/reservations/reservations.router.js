/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router.route("/:reservationId")
    .get(controller.read)
    .delete(controller.destroy)
    .put(controller.update)
    .all(methodNotAllowed);

router.route("/:reservationId/status")
    .put(controller.status)
    .all(methodNotAllowed);

module.exports = router;