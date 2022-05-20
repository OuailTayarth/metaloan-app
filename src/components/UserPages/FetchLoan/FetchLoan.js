import React from "react";
import "../FetchBorrowers/FetchBorrowers.css";



const FetchLoan = ({LoanData, tokenPaymentAddress}) => {
    return (
        <div className="loan-container">
        {Object.keys(LoanData).length > 0 ? (
            <div className="single-borrower">
                <h1 >Borrower address: <span>{LoanData.borrower} </span></h1>
                <h1>Total Payment: <span> {LoanData.totalPayment} </span></h1>
                <h1>Loan Start: <span>{LoanData.startLoan} </span></h1>
                <h1>NextPayment: <span>{LoanData.nextPayment} </span></h1>
                <h1>Loan status: <span> {LoanData.activated} </span></h1>
             </div>
        ) : (
            <h1 className="message">Loan does not exist</h1>
        )}
        </div>
        
    )
}


export default FetchLoan;