import React from "react";
import {fetchJson} from "../utils/api";

/**
 * Single reservation component
 * @param {array} reservation
 * @param {stateManager} setReservations 
 * @returns {JSX.Element}
 */
function Reservation({reservation, setReservations}) {
    const {reservation_id} = reservation;

    //handles canceling of a reservation
    async function onCancel() {
        const API_BASE_URL =
            process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
        
        //if we cancel the reservation
        //PUT to /reservations/:reservation_id/status with new status 'cancelled'
        let message = "Do you want to cancel this reservation? This cannot be undone.";
        if (window.confirm(message)) {
            await fetchJson(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {...reservation, status: "cancelled"}})
            });

            //refresh the reservations list
            const newReservations = await fetchJson(`${API_BASE_URL}/reservations?date=${reservation.reservation_date}`, {
                method: "GET"
            });
            setReservations(newReservations);
        }
    }

    return (
        <div className="card">
            <div className="card-body d-flex flex-column">
                First Name: {reservation.first_name}<br/>
                Last Name: {reservation.last_name}<br/>
                Mobile Number: {reservation.mobile_number}<br/>
                Time: {reservation.reservation_time}<br/>
                People: {reservation.people}<br/>
                <div data-reservation-id-status={reservation.reservation_id}>
                    Status: {reservation.status}
                </div>
                {/*if reservation status is booked display a Seat button*/}
                {reservation.status === "booked" ?
                    <a className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>Seat</a> : ""
                }
                <a href={`/reservations/${reservation_id}/edit`} className="btn btn-secondary">Edit</a>
                {/*if reservation status is booked display a Cancel button*/}
                {reservation.status === "booked" ?
                    <button className="btn btn-secondary" data-reservation-id-cancel={reservation.reservation_id} onClick={onCancel}>Cancel</button> : ""
                }
            </div>
        </div>
    );
}

export default Reservation;