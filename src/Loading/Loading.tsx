import React from "react";
import "./Loading.css";

const Loading = (): JSX.Element => {
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
