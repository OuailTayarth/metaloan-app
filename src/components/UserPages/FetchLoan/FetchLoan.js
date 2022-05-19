import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import React from "react";



const FetchLoan = ({LoanData}) => {
    return (
        <>
        {Object.keys(LoanData).length > 0 ? (
            <div>
                <h1>Borrower address: {LoanData.borrower}</h1>
                <h1>Total Payment: {LoanData.totalPayment}</h1>
                <h1>Loan Start: {LoanData.startLoan}</h1>
                <h1>NextPayment: {LoanData.nextPayment}</h1>
                <h1>Loan status: {LoanData.activated}</h1>
             </div>
        ) : (
            <h1>Loan does not exist</h1>
        )}
        </>
        
    )
}


export default FetchLoan;