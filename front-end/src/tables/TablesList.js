import React from "react";
import Table from "./Table";

/**
 * Table list component
 * @param {array} tables
 * @param {stateHandler} setTables
 * @param {stateHandler} setReservations
 * @param {string} date
 * @returns {JSX.Element}
 */
function TablesList({tables, setTables, setReservations, date}) {
    return (
        <div>
            {tables.map((table)=><Table table={table} setTables={setTables} setReservations={setReservations} date={date} key={table.table_id}/>)}
        </div>
    );
}

export default TablesList;