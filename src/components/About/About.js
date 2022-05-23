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
                <p>As the only lending company focused only on metaverse properties, MetaLoan is committed to making metaverse ownership accessible to everyone. We do this by utilizing a custom developed decentralized application that processes and services your loan on the blockchain. By using smart contract code, MetaLoan can handle metaverse loans at scale with efficiency that can’t be matched. These efficiencies making lending on metaverse land possible, and we pass those benefits on to you.</p>
                <button className='btn'
                        onClick={()=> navigate("launchApp/submitLoan")}>Get A Loan</button>
            </div>
        </div>
)
}


export default About;