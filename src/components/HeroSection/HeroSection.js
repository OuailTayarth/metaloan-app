import React from 'react';
import "./HeroSection.css";
import metaHeroImg from "../../assets/metaHero.png";
import { useNavigate } from 'react-router-dom';



const HeroSection = () => {
    const navigate = useNavigate();
    return (
            <div className="content">
                <div className="textBox">
                    <h4>DISCOVER HOW TO ENJOY MORE</h4>
                    <h2>MetaLoan</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea maxime fugit labore corporis eligendi rerum optio impedit quos, non sunt eius</p>

                    <div className="button-container">
                        <button 
                              className='btn' 
                              id='btn-left'
                              onClick={()=> navigate("launchApp")}>Get A Loan</button>
                        <button className='btn'>WhitePaper</button>
                    </div>
                </div>

                <div className="imgBox">
                    <img src={metaHeroImg} alt="ImageHero" className='metaHero'/>
                </div>

                
            </div>

    )
}


export default HeroSection;


