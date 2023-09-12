import React from "react";
import Reservation from "./Reservation";

/**
 * List reservations component
 * @param {array} reservations
 * @param {stateManager} setReservations 
 * @returns {JSX.Element}
 */
function ReservationsList({reservations, setReservations}) {
    return (
        <div>
            {/*map over reservations and convert them to JSX returned from <Reservation/>*/}
            {reservations.map((reservation)=>{
                return <Reservation 
                    reservation={reservation}
                    setReservations={setReservations}
                    key={reservation.reservation_id}
                />
            })}
        </div>
    );
}

export default ReservationsList;