const tablesService = require("./tables.service");

async function tableExists(req, res, next) {
  const {tableId} = req.params;
  res.locals.foundTable = await tablesService.read(tableId);
  if (res.locals.foundTable) {
      next();
  }
  //if it doesnt exist return an error
  else {
      next({message: `Table id not found: ${tableId}`, status: 404});
  }
}

function hasTableName(req, res, next) {
  const data = req.body.data;
  if (!data.table_name) {
    next({message: "table_name field missing", status: 400});
  }
  if(data.table_name.length < 2) {
    next({message: "table_name must be at least two characters long", status: 400})
  }
  next();
}

function hasCapacity(req, res, next) {
  const data = req.body.data;
  if (!data.capacity) {
    next({message: "Capacity field missing", status: 400});
  }
  if (data.capacity <= 0) {
    next({message: "Table much have a capacity of at least one", status: 400});
  }
  next();
}

/**
 * List handler for tables resources
 */
async function list(req, res, next) {
  res.status(200).json({
    data: await tablesService.list(),
  });
}

async function create(req, res, next) {
  const givenTableData = req.body.data;
  const data = await tablesService.create(givenTableData);
  res.status(201).json({data});
}

async function read(req, res, next) {
  const data = res.locals.foundTable;
  res.status(200).json({data});
}

async function update(req, res, next) {
  const givenTableData = req.body.data;
  const {tableId} = req.params;
  const tableData = {
    ...res.locals.foundTable,
    ...givenTableData,
    table_id: Number(tableId)
  };
  
  const data = await tablesService.update(tableId, tableData);
  res.status(201).json({data});
}

async function destroy(req, res, next) {
  const {tableId} = req.params;
  await tablesService.destroy(tableId);
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [hasTableName, hasCapacity, create],
  read: [tableExists, read],
  update: [tableExists, update],
  destroy: [tableExists, destroy]
};