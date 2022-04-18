import React from 'react'
import './Testimonials.css';
import SingleClient from '../SingleClient/SingleClient';
import image1 from "../../assets/image-emily.jpg";
import image2 from "../../assets/image-jennie.jpg";
import image3 from "../../assets/image-thomas.jpg";

const Testimonials = () => {
    return (
        <section className="testimonials">
            <div className="top-title">
                <h1>Client testimonials</h1>
            </div>
            <div className="testimonials-container">
            <SingleClient src={image1}
                                    text="We put our trust in RLG and they delivered, making sure our needs were met and deadlines were always hit." 
                                    infoJob="Marketing Director"
                                    infoTitle="Emily R."/>


            <SingleClient src={image2}
                          text="RLG's enthusiasm coupled with their keen interest in our brand’s success made it a satisfying and enjoyable experience." 
                          infoJob="Chief Operating Officer"
                          infoTitle="Thomas S."/>                        


            <SingleClient src={image3}
                          text="Incredible end result! Our sales increased over 400% when we worked with RLG. Highly recommended!" 
                          infoJob="Business Owner"
                          infoTitle="Jennie F."/>                        

            </div>
        </section>
    )
}

export default Testimonials
