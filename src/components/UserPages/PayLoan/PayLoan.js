import React, {useState} from "react";

const PayLoan = ({payLoan,
                  decrementLoanId,
                  incrementLoanId,
                  loanId}) => {

    const [activePayment, setActivePayment] = useState(false);

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
                    <p className="btn" id="count">{loanId}</p>
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