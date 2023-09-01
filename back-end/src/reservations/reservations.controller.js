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

function hasReservationDate(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_date) {
    next({message: "Reservation date field missing", status: 400});
  }
  console.log(data.reservation_date);
  let dateArray = data.reservation_date.split("-");
  const year = Number(dateArray[0]);
  const month = Number(dateArray[1]) - 1; // minus one because date object starts month at 0
  const day = Number(dateArray[2]);
  const hour = res.locals.hour;
  const minute = res.locals.minute;

  const date = new Date(year, month, day, hour, minute);
  const dayOfWeek = date.getDay();
  const today = new Date();
  
  //if day of week is tuesday
  if (dayOfWeek === 2) {
    next({message:"Reservation cannot be on a Tuesday - closed", status: 400});
  }
  
  //if the date given is before today
  if(date < today) {
    next({message: "Reservation cannot be in the past", status: 400})
  }

  next();
}

function hasReservationTime(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_time) {
    next({message: "Reservation time field missing", status: 400});
  }
  
  let timeArray = data.reservation_time.split(":");
  const hour = Number(timeArray[0]);
  const minute = Number(timeArray[1]);
  const time = Number(`${timeArray[0]}${timeArray[1]}`);
  
  //for use in hasReservationDate
  res.locals.hour = hour;
  res.locals.minute = minute;

  if (hour > 23 || hour < 0) {
    next({message: "Reservation time must have a valid time", status: 400});
  }
  if (minute > 59 || minute < 0) {
    next({message: "Reservation time must have a valid time", status: 400});
  }

  if (time < 1030) {
    next({message: "Reservation cannot be before 10:30 AM", status: 400});
  }
  if (time > 2130) {
    next({message: "Reservation cannot be after 9:30 PM", status: 400});
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
  create: [hasFirstName, hasMobileNumber, hasReservationTime, hasReservationDate, hasPeople, create],
  read: [reservationExists, read],
  destroy: [reservationExists, destroy],
  update: [reservationExists, update]
};