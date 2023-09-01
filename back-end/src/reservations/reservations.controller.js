const reservationsService = require("./reservations.service");

async function reservationExists(req, res, next) {
  const {reservationId} = req.params;
  res.locals.foundReservation = await reservationsService.read(reservationId);
  if (res.locals.foundReservation) {
      next();
  }
  //if it doesnt exist return an error
  else {
      next({message: `Reservation id not found: ${reservationId}`, status: 404});
  }
}

function hasFirstName(req, res, next) {
  const data = req.body.data;
  if (!data.first_name) {
    next({message: "First name field missing", status: 400});
  }
  next();
}

function hasMobileNumber(req, res, next) {
  const data = req.body.data;
  if (!data.mobile_number) {
    next({message: "Mobile number field missing", status: 400});
  }
  next();
}

function hasReservationData(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_date) {
    next({message: "Reservation date field missing", status: 400});
  }
  next();
}

function hasReservationTime(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_time) {
    next({message: "Reservation time field missing", status: 400});
  }
  next();
}

function hasPeople(req, res, next) {
  const data = req.body.data;
  if (!data.people) {
    next({message: "People field missing", status: 400});
  }
  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  res.status(200).json({
    data: await reservationsService.list(),
  });
}

async function create(req, res, next) {
  const givenReservationData = req.body.data;
  const data = await reservationsService.create(givenReservationData);
  res.status(201).json({data});
}

async function read(req, res, next) {
  const data = res.locals.foundReservation;
  res.status(200).json({data});
}

async function destroy(req, res, next) {
  const {reservationId} = req.params;
  await reservationsService.destroy(reservationId);
  res.sendStatus(204);
}

async function update(req, res, next) {
  const givenReservationData = req.body.data;
  const {reservationId} = req.params;
  const reservationData = {
      ...res.locals.foundReservation,
      ...givenReservationData,
      reservation_id: Number(reservationId)
  };

  const data = await reservationsService.update(reservationId, reservationData);
  res.status(201).json({data});
}

module.exports = {
  list,
  create: [hasFirstName, hasMobileNumber, hasReservationData, hasReservationTime, hasPeople, create],
  read: [reservationExists, read],
  destroy: [reservationExists, destroy],
  update: [reservationExists, update]
};