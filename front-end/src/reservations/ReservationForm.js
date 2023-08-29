import React, { useEffect, useState } from "react";

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

        //make request to api,
        //use axios
        //if promise resolves to an error render that error
        //className="alert alert-danger"
        //   - The reservation date is a Tuesday as the restaurant is closed on Tuesdays.
        //   - The reservation date is in the past. Only future reservations are allowed.
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
                <input name="people" placeholder="0" required onChange={handleChange}/>
                
                <button type="button" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary">Cancel</button>
            </form>
        </div>
    );
}

export default ReservationForm;