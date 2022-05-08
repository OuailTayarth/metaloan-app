import React from "react";
import "./About.css";
import AboutImg from "../../assets/aboutImg.png";


const About = () => {
    return (
        <div className="about-content">
            <div className="imgBox">
                <img src={AboutImg} alt="aboutImg" className='metaHero'/>
            </div>

            <div className="textBox">
                <h2>About</h2>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea maxime fugit labore corporis eligendi rerum optio impedit quos, non sunt eius, atque sequi consectetur nostrum, similique perferendis repellendus ducimus porro!</p>
            </div>
        </div>
)
}


export default About;