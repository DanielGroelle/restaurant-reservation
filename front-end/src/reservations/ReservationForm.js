import React, { useEffect, useState } from "react";
import {fetchJson} from "../utils/api";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

function ReservationForm() {
    const initialFormData = {
        first_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    };

    const [formData, setFormData] = useState({...initialFormData});

    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        //update the database with the new card data
        try {
            const data = await fetchJson(`${API_BASE_URL}/reservations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {...formData}})
            });
            console.log("=============", data);
        }
        catch(error) {
            console.log(error);
        }
        
        //if promise resolves to an error render that error
        //className="alert alert-danger"

    }

    return (
        <div>
            <h1>Book Your Reservation</h1>
            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    First Name
                </label>
                <input name="first_name" type="text" placeholder="First Name" required onChange={handleChange}/>
                
                <label htmlFor="mobile_number">
                    Mobile Number
                </label>
                <input name="mobile_number" type="text" placeholder="XXX-XXX-XXXX" required onChange={handleChange}/>
                
                <label htmlFor="reservation_date">
                    Reservation Date
                </label>
                <input name="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" required onChange={handleChange}/>
                
                <label htmlFor="reservation_time">
                    Reservation Time
                </label>
                <input name="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" required onChange={handleChange}/>

                <label htmlFor="people">
                    Party Size
                </label>
                <input name="people" type="number" placeholder="0" required onChange={handleChange}/>
                
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary">Cancel</button>
            </form>
        </div>
    );
}

export default ReservationForm;