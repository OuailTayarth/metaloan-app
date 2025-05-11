import React from "react";
import "./OurTeam.css";
import { BsTwitter } from "react-icons/bs";
import { ImLinkedin2 } from "react-icons/im";
import devProfil from "../../assets/devProfil.png";
import metaProfil from "../../assets/eduardoAvatar.jpg";
import eduardoMeta from "../../assets/eduardoProfil.png";
import ouailBlock from "../../assets/OuailProfilPro.jpg";

const OurTeam = (): JSX.Element => {
  return (
    <div className="OurTeam-section" id="metateam">
      <h1 className="teamTitle">Our Team</h1>
      <div className="container">
        <div className="card">
          <div className="circle">
            <div className="imgBox">
              <img
                src={ouailBlock}
                className="img1"
                alt="blockchain developer"
              />
              <img
                src={devProfil}
                className="avatar"
                alt="blockchain developer"
              />
            </div>
          </div>
          <div className="content">
            <h3>Ouail Tayarth</h3>
            <div className="title">
              <h4>Front-End Developer</h4>
            </div>
            <div className="icons-content">
              <a
                href="https://www.linkedin.com/in/tayarthouail/"
                target="_blank"
                rel="noreferrer">
                {/* @ts-ignore */}
                <ImLinkedin2 className="icon" />
              </a>
              <a
                href="https://twitter.com/Tayarthouail"
                target="_blank"
                rel="noreferrer">
                {/* @ts-ignore */}
                <BsTwitter className="icon" />
              </a>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="circle">
            <div className="imgBox">
              <img src={eduardoMeta} alt="Eduardo" className="img2" />
              <img
                src={metaProfil}
                className="avatar"
                alt="blockchain developer"
              />
            </div>
          </div>
          <div className="content">
            <h3>Eduardo Dávalos</h3>
            <div className="title">
              <h4>
                Director of Metaverse Planning <br /> and Design
              </h4>
            </div>
            <div className="icons-content">
              <a
                href="https://www.linkedin.com/in/davametric/"
                rel="noreferrer"
                target="_blank">
                {/* @ts-ignore */}
                <ImLinkedin2 className="icon" />
              </a>
              <a
                href="https://twitter.com/metaversearchi_"
                rel="noreferrer"
                target="_blank">
                {/* @ts-ignore */}
                <BsTwitter className="icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
