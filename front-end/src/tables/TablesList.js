import React from "react";
import Table from "./Table";

function TablesList({tables}) {
    //order alphabetically
    return (
        <div>
            {tables.map((table)=><Table table={table} key={table.table_id}/>)}
        </div>
    );
}

export default TablesList;