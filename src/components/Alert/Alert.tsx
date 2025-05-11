import React, { useEffect } from "react";
import "./Alert.css";
import { AlertProps } from "../../models/alertProps";

const Alert: React.FC<AlertProps> = ({ removeAlert, msg }) => {
  useEffect(() => {
    const time = setTimeout(() => {
      removeAlert(false, "");
    }, 20000);

    return () => clearTimeout(time);
  }, [removeAlert]);

  return <p className="alert">{msg}</p>;
};

export default Alert;
