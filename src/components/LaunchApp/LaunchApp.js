import React from "react";
import UserNavbar from "../UserPages/UserNavbar/UserNavbar";



const LaunchApp = ({fetchLoanData, fetchBorrowersData}) => {
    return (
        <>
          <UserNavbar 
          fetchLoanData={fetchLoanData}
          fetchBorrowersData={fetchBorrowersData}/>
        </>
    )
}


export default LaunchApp;