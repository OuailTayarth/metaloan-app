import React, { useRef, useState } from 'react';
import './ContactForm.css';
import emailsjs from "@emailjs/browser";




const ContactForm = () => {
  const form = useRef();

  const [disabled, setDisabled] = useState(false);
  const handleClick = () => setDisabled(!disabled);


  const sendEmail = (e) => {
    e.preventDefault();

    emailsjs.sendForm("service_r8eentc","template_51zyd8b", form.current, "7ynNpxuSKCAwDl4oo")
            .then((result) => {
              console.log(result.text);
              e.target.reset();
            })
            .then((error)=> {
              console.log(error.text);
            });
  } 

    return (
        <section className="contacts" id="booking">
  
        <div className="title">
          <h2>Request a Loan</h2>
          <p>Complete this form to receive your custom loan plan</p>
        </div>

        <form ref={form} class="book-form" onSubmit={sendEmail}>
          <div className="inputBox">
            <input type="text" name="user_name" placeholder="First & Last Name"/>
          </div>

          <div className="inputBox">
            <input type="email" name="user_email" placeholder=" Email" required/>
          </div>

          <div className="inputBox">
            <input type="text" name="user_link" placeholder="Link to the desired Land(Decentraland) "/>
          </div>

          <div className="inputBox">
            <textarea name="user_message" placeholder="Anything else we should know" rows="10" ></textarea>
          </div>

          <div className="checkbox-container">
            <input type="checkbox" id="scales" name="scales" disabled={handleClick} />
            <label for="scales">MetaLoan requires payment of a 30% down payment before any purchase. By submitting a request you acknowledge this requirement.</label>
          </div>

          <div className="inputBox">
            <input type="Submit"/>
          </div>
        </form>

      </section>
    )
}

export default ContactForm;