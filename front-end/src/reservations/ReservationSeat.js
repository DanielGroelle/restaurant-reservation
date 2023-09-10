import React, { useEffect, useState } from "react";
import {useParams, useHistory} from "react-router-dom";
import {fetchJson, listTables} from "../utils/api";
import TableSelect from "../tables/TableSelect";
import ErrorAlert from "../layout/ErrorAlert";


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

    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await fetchJson(`${API_BASE_URL}/tables/${formData.table_id}/seat`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {reservation_id}})
            });
            setError();
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
            <ErrorAlert error={error}/>
            <form onSubmit={handleSubmit}>
                <select name="table_id" onChange={handleChange}>
                    {tables.map((table)=><TableSelect table={table} key={table.table_id}/>)}
                </select>
                <button type="submit" className="btn btn-secondary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={(()=>history.goBack())}>Cancel</button>
            </form>
        </div>
    );
}

export default ReservationSeat;