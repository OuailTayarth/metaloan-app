import React, { useEffect, useState } from "react";
import "./About.css";
import AboutImg from "../../assets/AboutUs.jpg";
import { useNavigate } from "react-router-dom";
import SplitText from "../../Utilis/split3.min";
import gsap from "gsap";

const About = () => {
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
    <div className="about-content" id="about" data-scroll-section>
      <div className={`textBox ${isHidden ? "hidden" : ""}`}>
        <h2 className="hero-text">About Us</h2>
        <p className="hero-text">
          As the only lending company focused only on metaverse properties,
          MetaLoan is committed to making metaverse ownership accessible to
          everyone. We do this by utilizing a custom developed decentralized
          application that processes and services your loan on the blockchain.
          By using smart contract code, MetaLoan can handle metaverse loans at
          scale with efficiency that can’t be matched. These efficiencies making
          lending on metaverse land possible, and we pass those benefits on to
          you.
        </p>
        <div className="hero-text">
          <button
            className="btn"
            onClick={() => navigate("launchApp/submitLoan")}>
            Request A Loan
          </button>
        </div>
      </div>
      <div className="imgBox">
        <img src={AboutImg} alt="aboutImg" className="metaHero" />
      </div>
    </div>
  );
};

export default About;
