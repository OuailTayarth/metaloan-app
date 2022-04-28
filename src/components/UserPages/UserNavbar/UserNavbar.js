import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./UserNavbar.css";

const UserNavbar = () => {

    return (
        <>
        <div className="launch-link">
             <ul className="navigation">

                 <li>
                    <Link to="createPlan">Create Plan</Link>      
                 </li>
                 
                 <li>
                    <Link to="submitLoan">Submit Loan</Link>      
                 </li>
                      
                 <li>
                    <Link to="fetchLoan">Fetch Loan</Link> 
                 </li>
 
                 <li>
                    <Link to="payLoan">Pay Loan</Link>  
                 </li>

                 <li>
                    <Link to="fetchBorrowers">Borrowers</Link>
                 </li>

             </ul>
        </div>
        <Outlet/>
        </>
     )
    
}


export default UserNavbar;

