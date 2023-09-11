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

  const valid = isValidMobileNumber(data.mobile_number);

  if(!valid) {
    res.locals.errors.push({message: "mobile_number must be valid", status: 400});
  }

  if (data.mobile_number?.length === 10 && valid) {
    let mobileNumberOne = data.mobile_number.slice(0, 3);
    let mobileNumberTwo = data.mobile_number.slice(3, 6);
    let mobileNumberThree = data.mobile_number.slice(6, 10);

    req.body.data.mobile_number = `${mobileNumberOne}-${mobileNumberTwo}-${mobileNumberThree}`;
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

  if(!isValidDate(data.reservation_date)) {
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

function isValidDate(date) {
  let dateArray = date?.split("-") ?? ["", "", ""];
  const year = Number(dateArray[0]);
  const month = Number(dateArray[1]) - 1; // minus one because date object starts month at 0
  const day = Number(dateArray[2]);

  if(!isNaN(year) && !isNaN(month) && !isNaN(day)) {
    if (dateArray[0].length !== 4) {
      return false;
    }
    if (dateArray[1].length !== 2 || month < 0 || month > 11) {
      return false;
    }
    if (dateArray[2].length !== 2 || day <= 0 || day > 31) {
      return false;
    }
  }
  else {
    return false;
  }

  return true;
}

function isValidMobileNumber(mobile_number) {
  let mobileArray = mobile_number?.split("-") ?? ["", "", ""];
  let mobileNumberOne;
  let mobileNumberTwo;
  let mobileNumberThree;

  if (mobileArray[1]?.length > 0) {
    mobileNumberOne = mobileArray[0];
    mobileNumberTwo = mobileArray[1];
    mobileNumberThree = mobileArray[2];

    if (mobileNumberOne.length !== 3 || mobileNumberTwo.length !== 3 || mobileNumberThree.length !== 4) {
      return false;
    }
  }
  else if (mobile_number?.length === 10) {
    mobileNumberOne = mobile_number.slice(0, 3);
    mobileNumberTwo = mobile_number.slice(3, 6);
    mobileNumberThree = mobile_number.slice(6, 10);
  }

  if (isNaN(Number(mobileNumberOne)) || isNaN(Number(mobileNumberTwo)) || isNaN(Number(mobileNumberThree))) {
    return false;
  }

  return true;
}

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  let reservations = await reservationsService.list();
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  
  //for ?date= queries
  if (isValidDate(date)) {
    reservations = reservations.filter((reservation)=>{
      let reservationDate = reservation.reservation_date.toJSON();
      reservationDate = reservationDate.slice(0, reservationDate.indexOf("T"))
      return reservationDate === date;
    });
    reservations = reservations.filter((reservation)=>reservation.status !== "finished");
  }
  
  //sort reservations by time
  reservations.sort((a, b)=>{
    aHour = a.reservation_time.slice(0,2);
    aMin = a.reservation_time.slice(3,5);
    bHour = b.reservation_time.slice(0,2);
    bMin = b.reservation_time.slice(3,5);
    
    if (aHour - bHour !== 0) {
      return aHour - bHour;
    }
    return aMin - bMin;
  });

  //for ?mobile_number= queries
  if (mobile_number) {
    reservations = reservations.filter((reservation)=>reservation.mobile_number.includes(mobile_number));
    res.status(200).json({data: reservations});
    return;
  }
  
  res.status(200).json({
    data: reservations
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
    return;
  }

  //create the reservation and send back data
  //delete the 'frontend' key so it doesnt interfere with reservation creation
  delete req.body.data.frontend;
  
  const givenReservationData = req.body.data;
  const data = await reservationsService.create(givenReservationData);
  res.status(201).json({data});
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
    return;
  }

  //delete the 'frontend' key so it doesnt interfere with reservation creation
  delete req.body.data.frontend;
  
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

async function status(req, res, next) {
  const givenReservationData = req.body.data;
    const {reservationId} = req.params;
    const reservationData = {
      ...res.locals.foundReservation,
      ...givenReservationData,
      reservation_id: Number(reservationId)
    };
    
    const status = givenReservationData.status;

    if (status === undefined) {
      next({message: "status missing", status: 400})
      return;
    }

    if (!(status === "booked" || status === "seated" || status === "finished" || status === "cancelled")) {
      next({message: "unknown status", status: 400})
      return;
    }

    if (res.locals.foundReservation.status === "finished") {
      next({message: "finished reservations cannot be updated", status: 400});
      return;
    }

    const data = await reservationsService.update(reservationId, reservationData);
    res.status(200).json({data});
}

module.exports = {
  list,
  create: [hasFirstName, hasLastName, hasMobileNumber, hasReservationTime, hasReservationDate, hasPeople, create],
  read: [reservationExists, read],
  update: [reservationExists, hasFirstName, hasLastName, hasMobileNumber, hasReservationTime, hasReservationDate, hasPeople, update],
  destroy: [reservationExists, destroy],
  status: [reservationExists, status]
};