import React, {useState} from "react";
import {fetchJson} from "../utils/api";

function Table({table}) {
    const [deleted, setDeleted] = useState(false);
    
    async function onFinish(table_id) {
        const API_BASE_URL =
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
        
        let message = "Is this table ready to seat new guests? This cannot be undone.";
        if (window.confirm(message)) {
            await fetchJson(`${API_BASE_URL}/tables/${table_id}/seat`, {
                method: "DELETE"
            });
            setDeleted(true);
        }
    }

    if (deleted) {
        return (
            <></>
        );
    }
    else {
        return (
            <div className="card">
                <div className="card-body d-f flex-column">
                    {table.table_name}
                    <div data-table-id-status={table.table_id}>
                        {table.reservation_id ? 
                        <>
                            Occupied
                            <button className="btn btn-primary" data-table-id-finish={table.table_id} onClick={()=>{onFinish(table.table_id)}}>Finish</button>
                        </>
                            :
                        "Free"
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Table;