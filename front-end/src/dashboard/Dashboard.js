import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { today } from "../utils/date-time";
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
  date = query.get("date") ?? date;


  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((listedReservations)=>{
        const filteredReservations = listedReservations.filter((reservation)=>reservation.status !== "finished");
        setReservations(filteredReservations);
      })
      .catch(setReservationsError);
    listTables()
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function changeDate(value) {
    if (value === 0) {
      date = today();
    }

    const dateArray = date.split("-");
    const year = Number(dateArray[0]);
    const month = Number(dateArray[1]) - 1;
    const day = Number(dateArray[2]) + 1;
    
    let newDate = new Date(year, month, day);
    newDate.setDate(newDate.getDate() - 1 + value);

    newDate = newDate.toJSON();
    date = newDate.slice(0, newDate.indexOf("T"));
    history.push(`/dashboard?date=${date}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-flex flex-column mb-3">
        <h4 className="mb-0">Reservations for date</h4>
        <ErrorAlert error={reservationsError} />
        <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-primary" onClick={(()=>changeDate(-1))}>Previous</button>
          <button type="button" className="btn btn-primary" onClick={(()=>changeDate(0))}>Today</button>
          <button type="button" className="btn btn-primary" onClick={(()=>changeDate(1))}>Next</button>
        </div>
        <ReservationsList reservations={reservations} setReservations={setReservations}/>
      </div>
      <div className="d-flex flex-column mb-3">
        <h4>Tables</h4>
        <ErrorAlert error={tablesError}/>
        <TablesList tables={tables} setTables={setTables} setReservations={setReservations} date={date}/>
      </div>
    </main>
  );
}

export default Dashboard;