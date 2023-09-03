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
  //errors array that will be appended to
  res.locals.errors = [];

  const data = req.body.data;
  if (!data.first_name) {
    res.locals.errors.push({message: "First name field missing", status: 400});
  }
  next();
}

function hasMobileNumber(req, res, next) {
  const data = req.body.data;
  if (!data.mobile_number) {
    res.locals.errors.push({message: "Mobile number field missing", status: 400});
  }

  let mobileArray = data.mobile_number.split("-");
  const mobileNumberOne = mobileArray[0];
  const mobileNumberTwo = mobileArray[1];
  const mobileNumberThree = mobileArray[2];

  if (mobileNumberOne.length !== 3 || mobileNumberTwo.length !== 3 || mobileNumberThree.length !== 4) {
    res.locals.errors.push({message: "Mobile number must be valid", status: 400});
  }
  next();
}

function hasReservationDate(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_date) {
    res.locals.errors.push({message: "Reservation date field missing", status: 400});
  }
  
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
    res.locals.errors.push({message:"Reservation cannot be on a Tuesday - closed", status: 400});
  }
  
  //if the date given is before today
  if(date < today) {
    res.locals.errors.push({message: "Reservation must be in the future", status: 400})
  }

  next();
}

function hasReservationTime(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_time) {
    res.locals.errors.push({message: "Reservation time field missing", status: 400});
  }
  
  let timeArray = data.reservation_time.split(":");
  const hour = Number(timeArray[0]);
  const minute = Number(timeArray[1]);
  const time = Number(`${timeArray[0]}${timeArray[1]}`);
  
  //for use in hasReservationDate
  res.locals.hour = hour;
  res.locals.minute = minute;

  if (hour > 23 || hour < 0) {
    res.locals.errors.push({message: "Reservation time must have a valid hour", status: 400});
  }
  if (minute > 59 || minute < 0) {
    res.locals.errors.push({message: "Reservation time must have a valid minute", status: 400});
  }

  if (time < 1030) {
    res.locals.errors.push({message: "Reservation cannot be before 10:30 AM", status: 400});
  }
  if (time > 2130) {
    res.locals.errors.push({message: "Reservation cannot be after 9:30 PM", status: 400});
  }
  next();
}

function hasPeople(req, res, next) {
  const data = req.body.data;
  if (!data.people) {
    res.locals.errors.push({message: "People field missing", status: 400});
  }
  if (data.people <= 0) {
    res.locals.errors.push({message: "Reservation much have at least one person", status: 400});
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
  //if we have errors
  if (res.locals.errors.length > 0) {
    //if the request came from the frontend
    if (req.body.data.frontend) {
      const errorMessage = res.locals.errors.map(err => err.message).join(", ");
      res.status(400).json({error: errorMessage});
    }
    //if the request came from elsewhere
    else {
      res.status(400).json({error: res.locals.errors[0].message});
    }
  }
  //if we dont have errors, create the reservation and send back data
  else {
    //delete the 'frontend' key so it doesnt interfere with reservation creation
    if (req.body.data.frontend) delete req.body.data.frontend;
    
    const givenReservationData = req.body.data;
    const data = await reservationsService.create(givenReservationData);
    res.status(201).json({data});
  }
}

async function read(req, res, next) {
  const data = res.locals.foundReservation;
  res.status(200).json({data});
}

async function update(req, res, next) {
  //
  //need to add validation to update data
  //
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

async function destroy(req, res, next) {
  const {reservationId} = req.params;
  await reservationsService.destroy(reservationId);
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [hasFirstName, hasMobileNumber, hasReservationTime, hasReservationDate, hasPeople, create],
  read: [reservationExists, read],
  update: [reservationExists, update],
  destroy: [reservationExists, destroy]
};