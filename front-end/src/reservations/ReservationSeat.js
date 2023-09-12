import React, { useEffect, useState } from "react";
import {useParams, useHistory} from "react-router-dom";
import {fetchJson, listTables} from "../utils/api";
import TableSelect from "../tables/TableSelect";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Reservation seat form component
 * @returns {JSX.Element}
 */
function ReservationSeat() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
    const {reservation_id} = useParams();
    let history = useHistory();

    const initialFormData = {
        table_id: "0",
    };

    const [formData, setFormData] = useState({...initialFormData});
    const [error, setError] = useState();
    const [tables, setTables] = useState([{table_name:"", table_id:99, capacity:0}]);

    //loads tables to be used in the select element
    useEffect(()=>{
        (async ()=>{
            try {
                const data = await listTables();
                setError();
                setTables([...data]);
                setFormData({table_id: data[0].table_id})
            }
            catch (error) {
                setError(error);
            }
        })();
    },[]);

    //handles form change event
    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }

    //handles submitting of the form
    async function handleSubmit(event) {
        event.preventDefault();

        //put to /tables/:table_id/seat with the reservation_id
        try {
            await fetchJson(`${API_BASE_URL}/tables/${formData.table_id}/seat`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {reservation_id}})
            });
            setError();

            //get the reservation data to redirect to the dashboard with that date
            const reservation = await fetchJson(`${API_BASE_URL}/reservations/${reservation_id}`, {
                method: "GET"
            });
            const date = reservation.reservation_date;
            history.push(`/dashboard?date=${date.slice(0, date.indexOf("T"))}`);
        }
        catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            {/*display errors returned from backend*/}
            <ErrorAlert error={error}/>
            <form className="d-flex" onSubmit={handleSubmit}>
                <select name="table_id" onChange={handleChange}>
                    {/*map over tables to generate JSX for each*/}
                    {tables.map((table)=><TableSelect table={table} key={table.table_id}/>)}
                </select>

                <div className="d-flex">
                    <button type="submit" className="btn btn-secondary" style={{width: "80px"}}>Submit</button>
                    <button type="button" className="btn btn-secondary" style={{width: "80px"}} onClick={(()=>history.goBack())}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ReservationSeat;