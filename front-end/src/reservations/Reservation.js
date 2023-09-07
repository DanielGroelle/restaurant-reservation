import React, {useState} from "react";
import {fetchJson} from "../utils/api";

function Reservation({reservation}) {
    //implement cancel confirmation
    const {reservation_id} = reservation;
    const [update, setUpdate] = useState(false);
    
    async function onCancel() {
        const API_BASE_URL =
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
        
        let message = "Do you want to cancel this reservation? This cannot be undone.";
        if (window.confirm(message)) {
            await fetchJson(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {...reservation, status: "cancelled"}})
            });
            setUpdate(true);
        }
    }

    return (
        <div className="card">
            <div className="card-body d-flex flex-column">
                First Name: {reservation.first_name}<br/>
                Mobile Number: {reservation.mobile_number}<br/>
                Time: {reservation.reservation_time}<br/>
                People: {reservation.people}<br/>
                <div data-reservation-id-status={reservation.reservation_id}>
                    Status: {reservation.status}
                </div>
                {reservation.status === "booked" ?
                    <a className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>Seat</a> : ""
                }
                <a href={`/reservations/${reservation_id}/edit`} className="btn btn-secondary">Edit</a>
                {reservation.status === "booked" ?
                    <button className="btn btn-secondary" data-reservation-id-cancel={reservation.reservation_id} onClick={onCancel}>Cancel</button> : ""
                }
            </div>
        </div>
    );
}

export default Reservation;