import React, { useEffect, useState } from "react";

function TableForm() {
    const initialFormData = {
        table_name: "",
        capacity: ""
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
        //if promise resolves to an error render that error
        //className="alert alert-danger"
    }

    return (
        <div>
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