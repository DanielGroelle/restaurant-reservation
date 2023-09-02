import React, { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";

function ErrorList({errors}) {
    if (errors.length === 0) {
        return (
            <>
            </>
        );
    }
    return (
        <div>
            {errors.map((error) => (<ErrorAlert error={error} key={error.message}/>) )}
        </div>
    );
}

export default ErrorList;