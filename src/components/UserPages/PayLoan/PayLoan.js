import React from "react";



const PayLoan = ({payLoan}) => {
    return (
        <div>
            <button onClick={(e)=> {
                e.preventDefault();
                payLoan();
                }}>
            Pay Loan
            </button>
        </div>
    )
}


export default PayLoan;