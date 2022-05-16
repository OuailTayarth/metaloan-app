import React, {useState} from "react";

const PayLoan = ({payLoan}) => {

    const [LoanId, setLoanId] = useState(1);
    const [activePayment, setActivePayment] = useState(false);


    // Increment Loan Id
    function incrementLoanId() {
        let newLoanId = LoanId + 1;
        if(newLoanId > 100) {
            newLoanId = 100;
        }
        setLoanId(newLoanId);
    }

    // Decrement Loan Id
    function decrementLoanId() {
        let newLoanId = LoanId + 1;
        if(newLoanId > 1) {
            newLoanId = 1;
        }
        setLoanId(newLoanId);
    }

    return (
        <div className="submit-container">
            <h1>Make sure to pay your loan on time! </h1>

            <div className="count-buttons">
                <button 
                        className="btn" 
                        id="count"
                        disabled={activePayment ? 1 : 0}
                        onClick={()=> {
                        decrementLoanId();
                    }}>-</button>
                    <p className="btn" id="count">{LoanId}</p>
                    <button 
                        className="btn" 
                        id="count"
                        disabled={activePayment ? 1 : 0}
                        onClick={()=> {
                        incrementLoanId();
                    }}>+</button>
            </div>
            <h4>Make sure to select the right number of your loan offer before your pay</h4>

                    <button className="btn"
                        id="launchApp-btn"
                        onClick={(e)=> {
                        e.preventDefault();
                        payLoan();
                    }}>Pay Loan</button>
            </div>
    )
}


export default PayLoan;