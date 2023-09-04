import React, { useEffect, useState } from "react";
import Reservation from "./Reservation";

function ReservationsList({reservations}) {
    return (
        <div>
            {reservations.map((reservation)=><Reservation reservation={reservation} key={reservation.reservation_id}/>)}
        </div>
    );
}

export default ReservationsList;