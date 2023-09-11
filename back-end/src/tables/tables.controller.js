const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

async function tableExists(req, res, next) {
  const {tableId} = req.params;
  res.locals.foundTable = await tablesService.read(tableId);
  if (res.locals.foundTable) {
      next();
  }
  //if it doesnt exist return an error
  else {
      next({message: `table id not found: ${tableId}`, status: 404});
  }
}

function hasTableName(req, res, next) {
  const data = req.body.data;

  if(!data) {
    next({message: "data missing", status: 400});
  }
  if (!data.table_name) {
    next({message: "table_name field missing", status: 400});
  }
  if(data.table_name?.length < 2) {
    next({message: "table_name must be at least two characters long", status: 400})
  }
  next();
}

function hasCapacity(req, res, next) {
  const data = req.body.data;
  if (!data.capacity) {
    next({message: "capacity field missing", status: 400});
  }
  if (typeof data.capacity !== "number") {
    next({message: "capacity must be a number", status: 400});
  } 
  if (data.capacity <= 0) {
    next({message: "table much have a capacity of at least one", status: 400});
  }
  next();
}

/**
 * List handler for tables resources
 */
async function list(req, res, next) {
  let tablesData = await tablesService.list();

  //sort tables alphabetically
  tablesData = tablesData.sort((a, b)=>a.table_name < b.table_name ? -1 : 1);
  res.status(200).json({
    data: tablesData
  });
}

async function create(req, res, next) {
  let givenTableData = req.body.data;

  if (givenTableData.reservation_id) {
    const reservation = await reservationsService.read(givenTableData.reservation_id);
    if (!reservation) {
      next({message: "reservation_id not valid", status: 400});
    }
  }
  
  const data = await tablesService.create(givenTableData);
  res.status(201).json({data});
}

async function read(req, res, next) {
  const data = res.locals.foundTable;
  res.status(200).json({data});
}

async function hasReservationId(req, res, next) {
  const givenTableData = req.body.data;
  if (givenTableData?.reservation_id === undefined) {
    next({message: "reservation_id missing", status: 400});
  }
  next();
}

async function update(req, res, next) {
  const givenTableData = req.body.data;
  const {tableId} = req.params;
  const tableData = {
    ...res.locals.foundTable,
    ...givenTableData,
    table_id: Number(tableId)
  };

  //check if there is data to update with
  if (!givenTableData) {
    next({message: "table data missing", status: 400});
    return;
  }

  //if not assigning a table to a reservation and just updating
  if (givenTableData.reservation_id === undefined) {
    const data = await tablesService.update(tableId, tableData);
    res.status(201).json({data});
    return;
  }

  //if table is already assigned to a reservation
  if (res.locals.foundTable.reservation_id) {
    next({message: "table is occupied", status: 400});
    return;
  }
  
  //find the current reservation to make sure it exists
  const reservation = await reservationsService.read(givenTableData.reservation_id);
  if (reservation) {

    if (reservation.status === "seated") {
      next({message: "reservation is already seated", status: 400});
      return;
    }

    if (reservation.people > res.locals.foundTable.capacity) {
      next({message: "table does not have sufficient capacity for reservation", status: 400});
    }
    else {
      await reservationsService.update(givenTableData.reservation_id, {
        status: "seated"
      });
      const data = await tablesService.update(tableId, tableData);
      res.status(200).json({data});
    }
  }
  //if reservation_id doesnt exist
  else {
    next({message: `reservation_id does not exist: ${givenTableData.reservation_id}`, status: 404});
  }
}

async function destroy(req, res, next) {
  const {tableId} = req.params;
  await tablesService.destroy(tableId);
  res.sendStatus(204);
}

async function deleteSeat(req, res, next) {
  const {tableId} = req.params;
  const tableData = {
    ...res.locals.foundTable,
    reservation_id: null,
    table_id: Number(tableId)
  };

  if (res.locals.foundTable.reservation_id === null) {
    next({message: "table is not occupied", status: 400});
  }
  else {
    await reservationsService.update(res.locals.foundTable.reservation_id, {
      status: "finished"
    });
    const data = await tablesService.update(tableId, tableData);
    res.status(200).json({data});
  }
}

module.exports = {
  list,
  create: [hasTableName, hasCapacity, create],
  read: [tableExists, read],
  update: [tableExists, update],
  destroy: [tableExists, destroy],
  updateSeat: [tableExists, hasReservationId, update],
  deleteSeat: [tableExists, deleteSeat]
};