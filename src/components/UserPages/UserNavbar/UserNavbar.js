import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./UserNavbar.css";




const UserNavbar = () => {
    return (
        <>
            <div className="launch-link">
                <Link to="submitLoan">Submit Loan</Link>
                <Link to="payLoan">Pay Loan</Link>
                <Link to="fetchLoan">Fetch Loan</Link>
                <Link to="fetchBorrowers">Borrowers</Link>
            </div>
            <Outlet/>
        </>
    )
}


export default UserNavbar;