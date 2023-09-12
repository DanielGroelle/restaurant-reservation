import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import {fetchJson} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Table form component
 * @returns {JSX.Element}
 */
function TableForm() {
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
    
    const initialFormData = {
        table_name: "",
        capacity: ""
    };
    let history = useHistory();

    const [formData, setFormData] = useState({...initialFormData});
    const [error, setError] = useState();

    //handle change event
    function handleChange(event) {
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);
    }
    
    //handle submitting form data
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            //POST to /tables with form data
            await fetchJson(`${API_BASE_URL}/tables`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"data": {...formData, capacity: Number(formData.capacity)}})
            });
            setError();
            history.push("/dashboard");
        }
        catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            {/*display errors from backend*/}
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
                
                <div className="d-flex">
                    <button type="submit" className="btn btn-primary" style={{width: "80px"}}>Submit</button>
                    <button type="button" className="btn btn-secondary" style={{width: "80px"}} onClick={()=>history.goBack()}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default TableForm;