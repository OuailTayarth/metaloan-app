import React from "react";
import "./About.css";
import AboutImg from "../../assets/aboutImg.png";
import { useNavigate } from "react-router-dom";


const About = () => {
    const navigate = useNavigate();
    return (
        <div className="about-content">
            <div className="imgBox">
                <img src={AboutImg} alt="aboutImg" className='metaHero'/>
            </div>

            <div className="textBox">
                <h2>About Us</h2>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea maxime fugit labore corporis eligendi rerum optio impedit quos, non sunt eius, atque sequi consectetur nostrum, similique perferendis repellendus ducimus porro!</p>
                <button className='btn'
                        onClick={()=> navigate("launchApp/submitLoan")}>Get A Loan</button>
            </div>
        </div>
)
}


export default About;