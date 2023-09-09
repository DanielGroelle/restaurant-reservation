const reservationsService = require("./reservations.service");

async function reservationExists(req, res, next) {
  const {reservationId} = req.params;
  
  //if we have a reservationId
  if (!isNaN(Number(reservationId))) {
    res.locals.foundReservation = await reservationsService.read(reservationId);
  }
  //if the reservation was found
  if (res.locals.foundReservation) {
    next();
  }
  //if it doesnt exist return an error
  else {
    next({message: `reservation id not found: ${reservationId}`, status: 404});
  }
}

function hasFirstName(req, res, next) {
  //errors array that will be appended to
  res.locals.errors = [];

  const data = req.body.data;

  if(!data) {
    next({message: "data missing", status: 400});
  }

  if (!data?.first_name) {
    res.locals.errors.push({message: "first_name field missing", status: 400});
  }
  next();
}

function hasLastName(req, res, next) {
  const data = req.body.data;
  if (!data.last_name) {
    res.locals.errors.push({message: "last_name field missing", status: 400});
  }
  next();
}

function hasMobileNumber(req, res, next) {
  const data = req.body.data;
  if (!data.mobile_number) {
    res.locals.errors.push({message: "mobile_number field missing", status: 400});
  }
  
  let mobileArray = data.mobile_number?.split("-") ?? [];
  const mobileNumberOne = mobileArray[0] ?? "";
  const mobileNumberTwo = mobileArray[1] ?? "";
  const mobileNumberThree = mobileArray[2] ?? "";

  if (mobileNumberOne.length !== 3 || mobileNumberTwo.length !== 3 || mobileNumberThree.length !== 4) {
    res.locals.errors.push({message: "mobile_number must be valid", status: 400});
  }
  next();
}

function hasReservationDate(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_date || data.reservation_date === "") {
    res.locals.errors.push({message: "reservation_date field missing", status: 400});
  }
  
  let dateArray = data.reservation_date?.split("-") ?? ["", "", ""];
  const year = Number(dateArray[0]);
  const month = Number(dateArray[1]) - 1; // minus one because date object starts month at 0
  const day = Number(dateArray[2]);
  const hour = res.locals.hour;
  const minute = res.locals.minute;

  if(!isNaN(year) && !isNaN(month) && !isNaN(day)) {
    if (dateArray[0].length !== 4) {
      res.locals.errors.push({message:"reservation_date must have a valid year", status: 400});
    }
    if (dateArray[1].length !== 2 || month < 0 || month > 11) {
      res.locals.errors.push({message:"reservation_date must have a valid month", status: 400});
    }
    if (dateArray[2].length !== 2 || day <= 0 || day > 31) {
      res.locals.errors.push({message:"reservation_date must have a valid day", status: 400});
    }
  }
  else {
    res.locals.errors.push({message: "reservation_date must be valid", status: 400});
  }

  const date = new Date(year, month, day, hour, minute);
  const dayOfWeek = date.getDay();
  const today = new Date();
  
  //if day of week is tuesday
  if (dayOfWeek === 2) {
    res.locals.errors.push({message:"reservation cannot be on a tuesday - closed", status: 400});
  }
  
  //if the date given is before today, only if we're not updating
  if(date < today && !res.locals.foundReservation) {
    res.locals.errors.push({message: "reservation must be in the future", status: 400});
  }

  next();
}

function hasReservationTime(req, res, next) {
  const data = req.body.data;
  if (!data.reservation_time) {
    res.locals.errors.push({message: "reservation_time field missing", status: 400});
  }

  let timeArray = data.reservation_time?.split(":") ?? [];
  const hour = Number(timeArray[0]);
  const minute = Number(timeArray[1]);
  const time = Number(`${timeArray[0]}${timeArray[1]}`);

  //checking that the time is valid
  if(isNaN(hour) || isNaN(minute)) {
    res.locals.errors.push({message: "reservation_time field must be a valid time", status: 400});
  }

  //for use in hasReservationDate
  res.locals.hour = hour;
  res.locals.minute = minute;

  if (hour > 23 || hour < 0) {
    res.locals.errors.push({message: "reservation_time must have a valid hour", status: 400});
  }
  if (minute > 59 || minute < 0) {
    res.locals.errors.push({message: "reservation_time must have a valid minute", status: 400});
  }

  if (time < 1030) {
    res.locals.errors.push({message: "reservation cannot be before 10:30 AM", status: 400});
  }
  if (time > 2130) {
    res.locals.errors.push({message: "reservation cannot be after 9:30 PM", status: 400});
  }
  next();
}

function hasPeople(req, res, next) {
  const data = req.body.data;
  if (!data.people) {
    res.locals.errors.push({message: "people field missing", status: 400});
  }
  if (typeof data.people !== "number") {
    res.locals.errors.push({message: "people field must be a number", status: 400});
  }
  if (data.people <= 0) {
    res.locals.errors.push({message: "reservation must have at least one person", status: 400});
  }
  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  //need to check if there are queries ?mobile_number=XXX-XXX-XXXX
  //needs to sort reservations by time (oldest first)
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
  //if we dont have errors, update the reservation and send back data
  else {
    //delete the 'frontend' key so it doesnt interfere with reservation creation
    if (req.body.data.frontend) delete req.body.data.frontend;
    
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
}

async function destroy(req, res, next) {
  const {reservationId} = req.params;
  await reservationsService.destroy(reservationId);
  res.sendStatus(204);
}

async function status(req, res, next) {
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
  create: [hasFirstName, hasLastName, hasMobileNumber, hasReservationTime, hasReservationDate, hasPeople, create],
  read: [reservationExists, read],
  update: [reservationExists, hasFirstName, hasLastName, hasMobileNumber, hasReservationTime, hasReservationDate, hasPeople, update],
  destroy: [reservationExists, destroy],
  status
};