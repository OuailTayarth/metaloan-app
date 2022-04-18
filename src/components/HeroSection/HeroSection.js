import React from "react";
import "./HeroSection.css";
import metaHeroImg from "../../assets/metaHero.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="content" data-scroll-section>
        <div className="textBox">
          <h4 id="hero-text">FINANCING THE METAVERSE</h4>
          <h2 id="hero-text">MetaLoan</h2>
          <p id="hero-text">
            The metaverse unlocks new opportunities to learn, explore, play and
            invest in virtual worlds. MetaLoan helps you own your piece of the
            metaverse by breaking the purchase price into small, affordable
            payments.
          </p>

          <div className="button-container" id="hero-text">
            <button
              className="btn"
              id="btn-left"
              onClick={() => navigate("/requestloan")}>
              Request A Loan
            </button>
          </div>
        </div>

        <div className="imgBox">
          <img src={metaHeroImg} alt="ImageHero" className="metaHero" />
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default HeroSection;
