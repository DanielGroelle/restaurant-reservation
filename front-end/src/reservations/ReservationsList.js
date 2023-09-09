import React from "react";
import Reservation from "./Reservation";

function ReservationsList({reservations, setReservations}) {
    return (
        <div>
            {reservations.map((reservation)=><Reservation reservation={reservation} setReservations={setReservations} key={reservation.reservation_id}/>)}
        </div>
    );
}

export default ReservationsList;