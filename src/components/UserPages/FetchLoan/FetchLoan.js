import React from "react";



const FetchLoan = ({LoanData}) => {
    return (
        <div>
            <h1>{LoanData.borrower}</h1>
            <h1>{LoanData.startLoan}</h1>
            <h1>{LoanData.nextPayment}</h1>
            <h1>{LoanData.activated}</h1>
        </div>
    )
}


export default FetchLoan;