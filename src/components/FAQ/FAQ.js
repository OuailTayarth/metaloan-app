import React,{useState} from "react";
import "./FAQ.css";
import { Data } from "./data";
import { FiPlus, FiMinus } from 'react-icons/fi';


const FAQ = () => {

    
    const [clicked, setClicked] = useState(false);

    // function to keep track of the clicked item
    const toggle = (index) => {

        if(clicked === index) {
            setClicked(null);
        }
        // else set clicked to a new clicked element
        setClicked(index);
    }

    return (
        <div className="accordion-section" id="faq">
            <div className="container">
                <h1 className="FAQTitle">Frequently Asked Questions</h1>
                {Data.map((item, index)=> {
                    return (
                        <div className="accordion-wrap">
                            <div className="wrap" onClick={()=> toggle(index)} key={index}>
                                <h1>{item.question}</h1>
                                <span>{clicked === index ? <FiMinus/> : <FiPlus/>}</span>
                            </div>

                            {clicked === index ? 
                            <div className="dropDown">
                                <h1>{item.answer}</h1>
                            </div>
                            : null}
                        </div>
                    )
                })}
            </div>
            
        </div>
    )
}


export default FAQ;