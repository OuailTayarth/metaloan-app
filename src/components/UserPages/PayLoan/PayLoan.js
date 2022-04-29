import React from "react";



const PayLoan = ({payLoan}) => {
    return (
        <div className="links-container">
            <h1>Make sure you pay your Loan on time</h1>
            <button className="btn" onClick={(e)=> {
                e.preventDefault();
                payLoan();
                }}>
            Pay Loan
            </button>
        </div>
        
    )
}


export default PayLoan;