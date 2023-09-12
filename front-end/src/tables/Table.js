import React from "react";
import {fetchJson} from "../utils/api";

/**
 * Single table component
 * @param {object} table
 * @param {stateManager} setTables
 * @param {stateManager} setReservations
 * @param {string} date 
 * @returns {JSX.Element}
 */
function Table({table, setTables, setReservations, date}) {
    async function onFinish(table_id) {
        const API_BASE_URL =
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
        
        //if dialog is confirmed,
        //make DELETE request to /tables/:table_id/seat
        //to remove the reservation_id from the table
        let message = "Is this table ready to seat new guests? This cannot be undone.";
        if (window.confirm(message)) {
            await fetchJson(`${API_BASE_URL}/tables/${table_id}/seat`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {reservation_id: null}})
            });
            
            //fetch updated tables data
            const newTables = await fetchJson(`${API_BASE_URL}/tables`, {
                method: "GET"
            });
            setTables(newTables);
            //fetch updated reservations data
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
                    {/*if table has a reservation_id attached to it
                    display 'Occupied' and a Finish button*/}
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