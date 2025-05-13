import React from "react";
import Alert from "../../Alert/Alert";
import { PayLoanProps } from "../../../models/payLoanProps";

const PayLoan: React.FC<PayLoanProps> = ({
  payLoan,
  decrementLoanId,
  incrementLoanId,
  loanId,
  alert,
  removeAlert,
  activePayment,
}) => {
  return (
    <div className="submit-container tree">
      <h1>Don't forget to pay your loan on time! </h1>

      <div className="count-buttons">
        <button
          className="btn"
          id="count"
          disabled={activePayment}
          onClick={() => {
            decrementLoanId();
          }}>
          -
        </button>
        <p className="btn" id="count">
          {loanId}
        </p>
        <button
          className="btn"
          id="count"
          disabled={activePayment}
          onClick={() => {
            incrementLoanId();
          }}>
          +
        </button>
      </div>

      <h4>
        Make sure to select the right number of your loan offer before your pay
      </h4>
      {alert.show && <Alert {...alert} removeAlert={removeAlert} />}
      <button
        className="btn"
        id="launchApp-btn"
        disabled={activePayment}
        onClick={(e) => {
          e.preventDefault();
          payLoan();
        }}>
        {activePayment ? "Busy..." : "Pay Loan"}
      </button>
    </div>
  );
};

export default PayLoan;
