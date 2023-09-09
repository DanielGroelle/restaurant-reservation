import React from "react";
import Table from "./Table";

function TablesList({tables, setTables}) {
    //order alphabetically
    return (
        <div>
            {tables.map((table)=><Table table={table} setTables={setTables} key={table.table_id}/>)}
        </div>
    );
}

export default TablesList;