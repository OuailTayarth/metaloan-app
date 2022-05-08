import React from "react";
import "../../UserPages/links-container.css";



const SubmitLoan = ({getLoan}) => {
    return (
        <div className="links-container">
            <h1>To Have your Loan accepted  you need to deposit 30% as down payment of the total amount of the Loan </h1>
            <button className="btn" onClick={(e)=> {
                e.preventDefault();
                getLoan();
            }}>Submit Loan</button>
        </div>
    )
}


export default SubmitLoan;