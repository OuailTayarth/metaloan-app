import React from 'react';
import "./HeroSection.css";
import metaHeroImg from "../../assets/metaHero.png";
import { useNavigate } from 'react-router-dom';



const HeroSection = () => {
    const navigate = useNavigate();
    return (
            <div className="content">
                <div className="textBox">
                    <h4>FINANCING THE METAVERSE</h4>
                    <h2>MetaLoan</h2>
                    <p>The metaverse unlocks new opportunities to learn, explore, play and invest in virtual worlds. MetaLoan helps you own your piece of the metaverse by breaking the purchase price into small, affordable payments.</p>

                    <div className="button-container">
                        <button 
                              className='btn' 
                              id='btn-left'
                              onClick={()=> navigate("/ContactForm")}>Request A Loan</button>
                        {/* <button className='btn'>WhitePaper</button> */}
                    </div>
                </div>

                <div className="imgBox">
                    <img src={metaHeroImg} alt="ImageHero" className='metaHero'/>
                </div>
            </div>

    )
}


export default HeroSection;


