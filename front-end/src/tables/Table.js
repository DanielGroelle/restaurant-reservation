import React from "react";

function Table({table}) {
    return (
        <div className="card">
            <div className="card-body">
                {table.table_name}
            </div>
        </div>
    );
}

export default Table;