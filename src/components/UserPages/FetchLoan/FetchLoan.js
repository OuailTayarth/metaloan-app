import React from "react";
import "../FetchBorrowers/FetchBorrowers.css";



const FetchLoan = ({LoanData}) => {
    return (
        <div className="loan-container tree">
        {Object.keys(LoanData).length > 0 ? (
            <div className="single-borrower">
                <h1 >Borrower address: <br/> <span>{LoanData.borrower} </span></h1>
                <h1>Total Payment: <br/> <span> {LoanData.totalPayment} USDC </span></h1>
                <h1>Loan Start: <br/> <span>{LoanData.startLoan} </span></h1>
                <h1>NextPayment: <br/> <span>{LoanData.nextPayment} </span></h1>
                <h1>Loan status:  <br/> <span> {LoanData.activated} </span></h1>
            </div>
        ) : (
            <h1 className="message">Loan does not exist</h1>
        )}
        </div>
        
    )
}


export default FetchLoan;