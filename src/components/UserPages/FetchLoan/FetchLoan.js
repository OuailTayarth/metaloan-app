import React from "react";



const FetchLoan = ({LoanData}) => {
    return (
        <div>
            <h1>Borrower address: {LoanData.borrower}</h1>
            <h1>Loan Start: {LoanData.startLoan}</h1>
            <h1>NextPayment: {LoanData.nextPayment}</h1>
            <h1>Loan status: {LoanData.activated}</h1>
        </div>
    )
}


export default FetchLoan;