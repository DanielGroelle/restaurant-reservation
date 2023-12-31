import React, { useState, useEffect } from "react";
import {useHistory, useParams} from "react-router-dom";
import {fetchJson} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Reservation form component
 * @param {boolean} edit
 * @returns {JSX.Element}
 */
function ReservationForm({edit}) {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
    const {reservation_id} = useParams();
    let history = useHistory();

    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    };

    const [formData, setFormData] = useState({...initialFormData});
    const [error, setError] = useState();

    //loads reservation data into form if we're editing
    useEffect(()=>{
        if(reservation_id){
            (async ()=> {
                let data = await fetchJson(`${API_BASE_URL}/reservations/${reservation_id}`, {
                    method: "GET"
                });
                setFormData({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    mobile_number: data.mobile_number,
                    reservation_date: data.reservation_date.slice(0, data.reservation_date.indexOf("T")),
                    reservation_time: data.reservation_time.slice(0, 5),
                    people: Number(data.people)
                });
            })();
        }
    }, [reservation_id, API_BASE_URL]);

    //updates form data for each change event
    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }
    
    //handles submitting of the form
    async function handleSubmit(event) {
        event.preventDefault();
        
        //assign method and url based on if we're editing or not
        const method = edit ? "PUT" : "POST"
        const url = edit ? `${API_BASE_URL}/reservations/${reservation_id}` : `${API_BASE_URL}/reservations`

        //update the database with the reservation data
        try {
            await fetchJson(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {...formData, people: Number(formData.people), frontend: true}})
                //frontend set to true so we get all errors from the api
            });
            setError();
            //redirect to the date of the reservation set
            history.push(`/dashboard?date=${formData.reservation_date}`);
        }
        catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            <h1>{edit ? "Edit" : "Book"} a Reservation</h1>
            
            {/*displays errors returned from backend*/}
            <ErrorAlert error={error}/>

            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    First Name
                </label>
                <input name="first_name" type="text" placeholder="First Name" required onChange={handleChange} value={formData.first_name}/>
                
                <label htmlFor="last_name">
                    Last Name
                </label>
                <input name="last_name" type="text" placeholder="Last Name" required onChange={handleChange} value={formData.last_name}/>
                
                <label htmlFor="mobile_number">
                    Mobile Number
                </label>
                <input name="mobile_number" type="text" placeholder="XXX-XXX-XXXX" required onChange={handleChange} value={formData.mobile_number}/>
                
                <label htmlFor="reservation_date">
                    Reservation Date
                </label>
                <input name="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" required onChange={handleChange} value={formData.reservation_date}/>
                
                <label htmlFor="reservation_time">
                    Reservation Time
                </label>
                <input name="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" required onChange={handleChange} value={formData.reservation_time}/>

                <label htmlFor="people">
                    Party Size
                </label>
                <input name="people" type="number" placeholder="0" required onChange={handleChange} value={formData.people}/>
                
                <div className="d-flex">
                    <button type="submit" className="btn btn-primary" style={{width: "80px"}}>Submit</button>
                    <button type="button" className="btn btn-secondary" style={{width: "80px"}} onClick={()=>history.goBack()}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ReservationForm;