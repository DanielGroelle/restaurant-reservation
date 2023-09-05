import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "../reservations/ReservationForm";
import TableForm from "../tables/TableForm";
import SearchForm from "../search/Search";
import ReservationSeat from "../reservations/ReservationSeat"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReservationSeat/>
      </Route>
      <Route exact={true} path="/tables/new">
        <TableForm/>
      </Route>
      <Route exact={true} path="/search">
        <SearchForm/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
