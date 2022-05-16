import React from "react";
import UserNavbar from "../UserPages/UserNavbar/UserNavbar";
import "./launchApp.css";

const LaunchApp = ({fetchLoanData, fetchBorrowersData}) => {
    return (
        <div className="launchApp-container">
          <UserNavbar 
          fetchLoanData={fetchLoanData}
          fetchBorrowersData={fetchBorrowersData}/>
        </div>
    )
}


export default LaunchApp;