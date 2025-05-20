import React from "react";
import UserNavbar from "../UserPages/UserNavbar/UserNavbar";
import "./launchApp.css";
import { LaunchAppProps } from "../../models/LaunchAppProps";
import { Outlet } from "react-router-dom";

const LaunchApp: React.FC<LaunchAppProps> = ({
  fetchLoanData,
  fetchBorrowersData,
}) => {
  return (
    <div className="launchApp-container">
      <UserNavbar
        fetchLoanData={fetchLoanData}
        fetchBorrowersData={fetchBorrowersData}
      />
      <Outlet />
    </div>
  );
};

export default LaunchApp;
