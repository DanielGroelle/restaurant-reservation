import React from "react";
import Table from "./Table";

function TablesList({tables, setTables, setReservations, date}) {
    //order alphabetically
    return (
        <div>
            {tables.map((table)=><Table table={table} setTables={setTables} setReservations={setReservations} date={date} key={table.table_id}/>)}
        </div>
    );
}

export default TablesList;