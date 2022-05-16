import React from "react";
import "../../UserPages/links-container.css";
import "./SubmitLoan.css";



const SubmitLoan = ({getLoan}) => {
    return (
        <div className="submit-container">
            <h1>To Have your Loan accepted  you need to deposit 30% as down payment of the total amount of the Loan </h1>

            <div className="count-buttons">
                <button 
                    className="btn" id="count">-</button>
                    <p className="btn" id="count">1</p>
                    <button className="btn" id="count">+</button>
            </div>
            <h4>Make sure to select the number of your loan offer your pay</h4>

                    <button className="btn"
                        id="launchApp-btn"
                        onClick={(e)=> {
                        e.preventDefault();
                        getLoan();
                    }}>Submit Loan</button>
            </div>
    )
}


export default SubmitLoan;