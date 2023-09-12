import React from "react";

/**
 * Table option component
 * @param {object} table 
 * @returns {JSX.Element}
 */
function TableSelect({table}) {
    return (
        <option value={table.table_id}>{table.table_name} - {table.capacity}</option>
    );
}

export default TableSelect;