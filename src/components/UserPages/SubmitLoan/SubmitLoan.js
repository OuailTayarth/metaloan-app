import React from "react";



const SubmitLoan = ({getLoan}) => {
    return (
        <div>
            <button onClick={(e)=> {
                e.preventDefault();
                getLoan();
            }}>Submit Loan</button>
        </div>
    )
}


export default SubmitLoan;