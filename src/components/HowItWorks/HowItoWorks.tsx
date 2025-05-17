import React, { useEffect, useState } from "react";
import "./HowItoWorks.css";
import HowItWorks from "../../../src/assets/HowItWorks.jpg";
import { useNavigate } from "react-router-dom";
import SplitText from "../../Utilities/splitText";
import gsap from "gsap";

const HowItoWorks = (): JSX.Element => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState<boolean>(true);

  useEffect(() => {
    const split = new SplitText(".hero-text", {
      type: "lines",
      linesClass: "LineChildren",
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
    <section className="howItWorks-content" id="howitworks" data-scroll-section>
      <div className="imgBox">
        <img src={HowItWorks} alt="aboutImg" className="metaHero" />
      </div>
      <div className={`textBox ${isHidden ? "hidden" : ""}`}>
        <h2 className="hero-text">How it Works</h2>
        <p className="hero-text">Get your MetaLoan with just 6 easy steps:</p>
        <ul className="requestLoan_list">
          <li className="hero-text">
            1. Fill out the Request a Loan form below.
          </li>
          <li className="hero-text">
            2. MetaLoan will review your inquiry and get back to you with a loan
            plan.
          </li>
          <li className="hero-text">
            3. You provide requested documentation and the down payment.
          </li>
          <li className="hero-text">
            4. MetaLoan purchases the metaverse land you’re interested in and
            gives you full use rights.
          </li>
          <li className="hero-text">
            5. You make secure payments via MetaLoan’s decentralized
            application, which provides you with accurate and verifiable
            transaction history on the blockchain.
          </li>
          <li className="hero-text">
            6. After you complete your monthly payments, MetaLoan sends the
            metaverse land to your wallet.
          </li>
        </ul>
        <div className="hero-text">
          <button className="btn" onClick={() => navigate("/requestloan")}>
            Request a Loan
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItoWorks;
