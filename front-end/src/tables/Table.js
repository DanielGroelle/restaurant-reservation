import React from "react";
import {fetchJson} from "../utils/api";

function Table({table, setTables, setReservations, date}) {
    async function onFinish(table_id) {
        const API_BASE_URL =
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
        
        let message = "Is this table ready to seat new guests? This cannot be undone.";
        if (window.confirm(message)) {
            await fetchJson(`${API_BASE_URL}/tables/${table_id}/seat`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {reservation_id: null}})
            });
            await fetchJson(`${API_BASE_URL}/reservations/${table.reservation_id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {status: "finished"}})
            });
            const newTables = await fetchJson(`${API_BASE_URL}/tables`, {
                method: "GET"
            });
            setTables(newTables);
            const newReservations = await fetchJson(`${API_BASE_URL}/reservations?date=${date}`, {
                method: "GET"
            });
            setReservations(newReservations);
        }
    }

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

export default Table;