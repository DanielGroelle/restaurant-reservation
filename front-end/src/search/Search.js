import React, { useState } from "react";
import { fetchJson } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";

/**
 * Search form component
 * @returns {JSX.Element}
 */
function SearchForm() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
    const initialFormData = {
        mobile_number: ""
    };

    const [formData, setFormData] = useState({...initialFormData});
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState();

    //handles change events for form
    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }
    
    //handles submitting of form data
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            //makes request to db with mobile_number from form
            const foundReservations = await fetchJson(`${API_BASE_URL}/reservations?mobile_number=${formData.mobile_number}`, {
                method: "GET"
            });
            setReservations(foundReservations);
            setError();
        }
        catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <label htmlFor="mobile_number">
                    Mobile Number
                </label>
                <input name="mobile_number" type="text" placeholder="Enter a customer's phone number" onChange={handleChange}/>

                <button type="submit" className="btn btn-primary">Find</button>
            </form>

            {/*displays errors from backend for searches*/}
            <ErrorAlert error={error} />
            <h4 className="mb-0">Found Reservations</h4>
            
            {/*displays "No reservations found" for an empty reservations array
            and displays reservation list otherwise*/}
            {reservations.length === 0 ?
                "No reservations found"
                    :
                <ReservationsList reservations={reservations} setReservations={setReservations}/>
            }
        </div>
    );
}

export default SearchForm;