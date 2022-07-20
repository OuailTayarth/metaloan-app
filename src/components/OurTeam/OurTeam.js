import "./OurTeam.css";
import { BsTwitter} from 'react-icons/bs';
import {ImLinkedin2} from "react-icons/im";
import devProfil from "../../assets/devProfil.png";
import metaProfil from "../../assets/Eduardo Avatar.jpg";
import eduardoMeta from "../../assets/Eduardo.png";
import ouailBlock from "../../assets/OuailProfilPro.jpg";

const OurTeam = () => {

    return (
        <div className="OurTeam-section">
            <h1 className="teamTitle">Our Team</h1>
            <div className="container"> 
                <div class="card">
                    <div class="circle">
                        <div class="imgBox">
                            <img src={ouailBlock}  className="img1" alt="blockchain developer"/>
                            <img src={devProfil} className="avatar" alt="blockchain developer"/>
                        </div>
                    </div>
                    <div class="content">
                        <h3>Ouail Tayarth</h3>
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
                            <img src={eduardoMeta} alt="Eduardo" className="img2"/>
                            <img src={metaProfil} className="avatar" alt="blockchain developer"/>
                        </div>
                    </div>
                    <div class="content">
                        <h3>Eduardo Dávalos</h3>
                        <div class="title">
                            <h4>Director of Metaverse Planning <br/> and Design</h4>
                        </div>
                        <div className="icons-content">
                            <a href="https://www.linkedin.com/in/davametric/"
                            rel="noreferrer" target="_blank">
                                <ImLinkedin2 className="icon"/>
                            </a>
                            <a href="https://twitter.com/metaversearchi_"
                            rel="noreferrer" target="_blank">
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