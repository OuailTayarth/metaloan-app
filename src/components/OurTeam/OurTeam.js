import "./OurTeam.css";
import { BsTwitter} from 'react-icons/bs';
import {ImLinkedin2} from "react-icons/im";
import devProfil from "../../assets/devProfil.png";

const OurTeam = () => {

    return (
        <div className="OurTeam-section">
            <h1 className="teamTitle">Our Team</h1>
            <div className="container"> 
                <div class="card">
                    <div class="circle">
                        <div class="imgBox">
                            <img src={devProfil} alt="blockchain developer"/>
                        </div>
                    </div>
                    <div class="content">
                        <h3>Tayarth Ouail</h3>
                        <div class="title">
                            <h4>Blockchain developer</h4>
                        </div>
                        <div className="icons-content">
                            <a href="https://www.linkedin.com/in/tayarthouail/" target="_blank" rel="noreferrer">
                                <ImLinkedin2 className="icon"/>
                            </a>
                            <a href="https://twitter.com/Tayarthouail" 
                            target="_blank" rel="noreferrer">
                                <BsTwitter className="icon"/>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="circle">
                        <div class="imgBox">
                            <img src={devProfil} alt="blockchain developer"/>
                        </div>
                    </div>
                    <div class="content">
                        <h3>Eduardo Dávalos</h3>
                        <div class="title">
                            <h4>Director of Metaverse <br/> Planning and Design</h4>
                        </div>
                        <div className="icons-content">
                            <a href="#">
                                <ImLinkedin2 className="icon"/>
                            </a>
                            <a href="#">
                                <BsTwitter className="icon"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default OurTeam;