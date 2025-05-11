import React from "react";
import "../FetchBorrowers/FetchBorrowers.css";
import { useSelector } from "react-redux";
import { FetchLoanProps } from "../../../models/fetchLoanProps";
import { RootState } from "../../../redux/store";
import { BlockchainStates } from "../../../models/blockchainStates";

const FetchLoan: React.FC<FetchLoanProps> = ({
  LoanData,
  isBorrowerAddress,
}) => {
  const blockchain = useSelector<RootState, BlockchainStates>(
    (state) => state.blockchain
  );

  return (
    <div className="loan-container tree">
      {LoanData != null &&
      Object.keys(LoanData).length > 0 &&
      blockchain.account === isBorrowerAddress ? (
        <div className="single-borrower">
          <h1>
            Borrower address: <br /> <span>{LoanData.borrower} </span>
          </h1>
          <h1>
            Total Payment: <br /> <span> {LoanData.totalPayment} USDT </span>
          </h1>
          <h1>
            Loan Start: <br /> <span>{LoanData.startLoan} </span>
          </h1>
          <h1>
            NextPayment: <br /> <span>{LoanData.nextPayment} </span>
          </h1>
          <h1>
            Loan status: <br /> <span> {LoanData.activated} </span>
          </h1>
        </div>
      ) : (
        <div className="message">
          <h1>Loan does not exist</h1>
        </div>
      )}
    </div>
  );
};

export default FetchLoan;
