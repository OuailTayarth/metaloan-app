import { Link, Outlet } from "react-router-dom";
import "./UserNavbar.css";

const UserNavbar = ({fetchLoanData, fetchBorrowersData}) => {

    return (
        <>
        <div className="launch-link">
             <ul className="links-Navigation">

                 <li>
                    <Link to="fetchBorrowers"
                          onClick={()=> fetchBorrowersData()}
                          >Borrowers</Link>
                 </li>

                 {/* <li>
                    <Link to="createPlan">Create Plan</Link>      
                 </li> */}
                 
                 <li>
                    <Link to="submitLoan">Submit Loan</Link>      
                 </li>
 
                 <li>
                    <Link to="payLoan">Pay Loan</Link>  
                 </li>

                 <li>
                    <Link to="fetchLoan" 
                          onClick={()=> fetchLoanData()}
                          id="lastChild">
                          MyLoan</Link> 
                 </li>

             </ul>
        </div>
        <Outlet/>
        </>
     )
    
}


export default UserNavbar;

