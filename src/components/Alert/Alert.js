import React, {useEffect} from "react";
import "./Alert.css";

const Alert = ({removeAlert, msg}) => {

    useEffect(()=> {
        const time = setTimeout(()=> {
            removeAlert();
        },20000)

        return ()=> clearTimeout(time);
    },[])


    return (
        <p className="alert">{msg}</p>
    )
}



export default Alert;




