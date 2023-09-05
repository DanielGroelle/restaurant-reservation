import React, { useState } from "react";

function SearchForm() {
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
        
    }

    return (
        <div>
            <form className="d-flex flex-column" onSubmit={handleSubmit}>
                <label htmlFor="mobile_number">
                    Mobile Number
                </label>
                <input name="mobile_number" type="text" placeholder="Enter a customer's phone number" onChange={handleChange}/>

                <button type="button" className="btn btn-primary">Find</button>

            </form>
        </div>
    );
}

export default SearchForm;