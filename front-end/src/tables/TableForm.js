import React, { useState } from "react";
import {fetchJson} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

function TableForm() {
    const initialFormData = {
        table_name: "",
        capacity: ""
    };

    const [formData, setFormData] = useState({...initialFormData});
    const [error, setError] = useState();

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
            setError();
        }
        catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            <ErrorAlert error={error}/>
            
            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <label htmlFor="table_name">
                    Table Name
                </label>
                <input name="table_name" type="" placeholder="Table Name" required onChange={handleChange}/>

                <label htmlFor="capacity">
                    Capacity
                </label>
                <input name="capacity" type="number" placeholder="0" required onChange={handleChange}/>
                
                <button type="button" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary">Cancel</button>
            </form>
        </div>
    );
}

export default TableForm;