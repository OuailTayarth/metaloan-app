import React from "react";


const FetchBorrowers = ({BorrowersData}) => {

    return (
        <>
        {BorrowersData.length > 0 ? (
            <>
            {BorrowersData.map((el, index) => {
                return (
                    <div key={index}>
                        <h1>Borrower: {el.borrower}</h1>
                        <h1>Loan Start: {el.start}</h1>
                        <h1>Next Payment: {el.nextPayment}</h1>
                        <h1>Loan status: {el.activated}</h1>
                    </div>
                )
            })}
            </>
            )
        : (
            <h1> No Borrowers exist yet...</h1>
        )} 
        </>
    );
}

export default FetchBorrowers;