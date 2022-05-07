import React from 'react';
import "./HeroSection.css";
import metaHeroImg from "../../assets/metaHero.png";
import play from "../../assets/play.png";
import close from "../../assets/close.png";
import trailer from "../../assets/Demo.mp4";



const HeroSection = () => {
    return (
        <div className="content">
            <div className="textBox">
                <h2>MetaLoan</h2>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea maxime fugit labore corporis eligendi rerum optio impedit quos, non sunt eius, atque sequi consectetur nostrum, similique perferendis repellendus ducimus porro!</p>
                <a href="#" class="play">
                <img src={play} alt="#"/>Watch Me</a>
            </div>

            <div class="demo">
              <video src={trailer} controls = true></video>
                <img src={close} class="close" alt="close"/>
            </div>

            <div className="imgBox">
                <img src={metaHeroImg} alt="ImageHero" className='metaHero'/>
            </div>
        </div>
    )
}


export default HeroSection;


