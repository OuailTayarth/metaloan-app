import React from "react";
import "./FetchBorrowers.css";

const FetchBorrowers = ({BorrowersData}) => {

    return (
        <div className="borrowers-container one">
        {BorrowersData.length > 0 ? (
            <>
            {BorrowersData.map((el, index) => {
                return (
                    <article key={index} className="single-borrower" >
                        <h1>Borrower Address : <br/> <span> {el.borrower} </span></h1>
                        <h1>Loan Start: <br/> <span>{el.start} </span> </h1>
                        <h1>Next Payment: <br/> <span>{el.nextPayment} </span></h1>
                        <h1>Loan status: <br/> <span>{el.activated} </span></h1>
                    </article>
                )
            })}
            </>
            )
        : (
            <h1 className="message"> No Borrowers exist yet...</h1>
        )} 
        </div>
    );
}

export default FetchBorrowers;