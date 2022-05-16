import React from "react";



const PayLoan = ({payLoan}) => {
    return (
        <div className="submit-container">
            <h1>To Have your Loan accepted  you need to deposit 30% as down payment of the total amount of the Loan </h1>

            <div className="count-buttons">
                <button 
                    className="btn" id="count">-</button>
                    <p className="btn" id="count">1</p>
                    <button className="btn" id="count">+</button>
            </div>
            <h4>Make sure to select the number of your loan offer you pay</h4>
                    <button className="btn"
                        id="launchApp-btn"
                        onClick={(e)=> {
                        e.preventDefault();
                        payLoan();
                    }}>Submit Loan</button>
            </div>
        
    )
}


export default PayLoan;