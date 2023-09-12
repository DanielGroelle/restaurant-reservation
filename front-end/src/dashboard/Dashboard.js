import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  let history = useHistory();
  const query = useQuery();
  //defaults to current date, otherwise set date to the value of query ?date=
  date = query.get("date") ?? date;

  useEffect(loadDashboard, [date]);
  //loads the reservation data as well as tables data,
  //and appropriately sets errors if there are any
  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables()
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-flex flex-column mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        {/*Displays reservation errors from fetching*/}
        <ErrorAlert error={reservationsError} />
        
        {/*Button group to navigate between dates*/}
        <div className="btn-group" role="group" aria-label="Change date">
          <button type="button" className="btn btn-primary" onClick={(()=>history.push(`/dashboard?date=${previous(date)}`))}>Previous</button>
          <button type="button" className="btn btn-primary" onClick={(()=>history.push(`/dashboard?date=${today()}`))}>Today</button>
          <button type="button" className="btn btn-primary" onClick={(()=>history.push(`/dashboard?date=${next(date)}`))}>Next</button>
        </div>

        {/*Lists reservations that were fetched
        Passes in setReservations to allow for updating of the array*/}
        <ReservationsList reservations={reservations} setReservations={setReservations}/>
      </div>
      <div className="d-flex flex-column mb-3">
        <h4>Tables</h4>
        {/*Displays table errors from fetching*/}
        <ErrorAlert error={tablesError}/>

        {/*Lists tables that were fetched
        Passes in setTables and setReservations to allow for updating of the arrays*/}
        <TablesList tables={tables} setTables={setTables} setReservations={setReservations} date={date}/>
      </div>
    </main>
  );
}

export default Dashboard;