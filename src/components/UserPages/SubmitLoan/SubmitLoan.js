import "../../UserPages/links-container.css";
import "./SubmitLoan.css";
import Alert from "../../Alert/Alert";

const SubmitLoan = ({
  getLoan,
  decrementLoanId,
  incrementLoanId,
  loanId,
  alert,
  removeAlert,
  activePayment,
}) => {
  return (
    <div className="submit-container two">
      <h1>
        To Have your Loan accepted, you have to deposit 30% as down payment of
        the total amount of the Loan{" "}
      </h1>

      <div className="count-buttons">
        <button
          className="btn"
          id="count"
          disabled={activePayment ? 1 : 0}
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
          disabled={activePayment ? 1 : 0}
          onClick={() => {
            incrementLoanId();
          }}>
          +
        </button>
      </div>
      <h4>
        Make sure to select the right number of your loan plan before your pay
      </h4>
      {alert.show && <Alert {...alert} removeAlert={removeAlert} />}
      <button
        className="btn"
        id="launchApp-btn"
        disabled={activePayment ? 1 : 0}
        onClick={(e) => {
          e.preventDefault();
          getLoan();
        }}>
        {activePayment ? "Busy..." : "Submit Loan"}
      </button>
    </div>
  );
};

export default SubmitLoan;
