import React from "react";

function TableSelect({table}) {
    return (
        <option value={table.table_id}>{table.table_name} - {table.capacity}</option>
    );
}

export default TableSelect;