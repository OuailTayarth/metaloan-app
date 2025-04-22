import React, { useEffect, useState } from "react";
import "./HeroSection.css";
import metaHeroImg from "../../assets/metaHero.png";
import { useNavigate } from "react-router-dom";
import SplitText from "../../Utilis/split3.min";
import gsap from "gsap";

const HeroSection = () => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const split = new SplitText(".hero-text", {
      type: "lines",
      linesClass: "LineChildren",
    });

    const splitParent = new SplitText(".hero-text", {
      type: "lines",
      linesClass: "LineParents",
    });

    setIsHidden(false);

    // Use gsap.fromTo to define the exact starting and ending states
    gsap.fromTo(
      split.lines,
      { y: 20, opacity: 0 }, // Starting state
      {
        duration: 1,
        y: 0,
        opacity: 1, // Ending state
        stagger: 0.1,
        ease: "power2",
      }
    );
  }, []);

  return (
    <>
      <div className="content" data-scroll-section>
        <div className={`textBox ${isHidden ? "hidden" : ""}`}>
          <h4 className="hero-text">FINANCING THE METAVERSE</h4>
          <h2 className="hero-text">MetaLoan</h2>
          <p className="hero-text">
            The metaverse unlocks new opportunities to learn, explore, play and
            invest in virtual worlds. MetaLoan helps you own your piece of the
            metaverse by breaking the purchase price into small, affordable
            payments.
          </p>

          <div className="button-container hero-text">
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
