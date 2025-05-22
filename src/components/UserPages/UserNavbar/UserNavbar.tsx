import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./UserNavbar.css";
import { LaunchAppProps } from "../../../models/LaunchAppProps";

const UserNavbar: React.FC<LaunchAppProps> = ({
  fetchLoanData,
  fetchBorrowersData,
}) => {
  useEffect(() => {
    fetchBorrowersData();
    fetchLoanData();
  }, []);

  return (
    <div className="launch-link">
      <ul className="links-Navigation">
        <li>
          <Link to="borrowers" onClick={() => fetchBorrowersData()}>
            Borrowers
          </Link>
        </li>
        <li>
          <Link to="submitLoan">Submit Loan</Link>
        </li>

        <li>
          <Link to="payLoan">Pay Loan</Link>
        </li>

        <li>
          <Link to="fetchLoan" onClick={() => fetchLoanData()} id="lastChild">
            MyLoan
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserNavbar;
