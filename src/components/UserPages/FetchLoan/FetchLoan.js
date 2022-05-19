import React from "react";
import "../FetchBorrowers/FetchBorrowers.css";



const FetchLoan = ({LoanData, tokenPaymentAddress}) => {
    return (
        <div className="borrowers-container">
        {Object.keys(LoanData).length > 0 ? (
            <div className="single-borrower">
                <h1 >Borrower address: {LoanData.borrower}</h1>
                <h1>Total Payment: {LoanData.totalPayment}</h1>
                <h1>Loan Start: {LoanData.startLoan}</h1>
                <h1>NextPayment: {LoanData.nextPayment}</h1>
                <h1>Loan status: {LoanData.activated}</h1>
             </div>
        ) : (
            <h1>Loan does not exist</h1>
        )}
        </div>
        
    )
}


export default FetchLoan;