import React, { useEffect, useState } from "react";

function Reservation({reservation}) {
    const {reservation_id} = reservation;
    return (
        <div className="card">
            <div className="card-body">
                First Name: {reservation.first_name}<br/>
                Mobile Number: {reservation.mobile_number}<br/>
                Time: {reservation.reservation_time}<br/>
                People: {reservation.people}<br/>
                <a className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>Seat</a>
            </div>
        </div>
    );
}

export default Reservation;