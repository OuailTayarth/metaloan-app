import React from "react";
import "./ErrorPage.css";

const ErrorPage = (): JSX.Element => {
  return (
    <div className="error-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default ErrorPage;
