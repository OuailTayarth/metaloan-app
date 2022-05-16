import React, { useRef } from 'react';
import './ContactForm.css';
import emailsjs from "@emailjs/browser";



const ContactForm = () => {
  const form = useRef();

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
        <section class="contacts" id="booking">
  
        <div class="title">
          <h2>Contact us</h2>
          <p>Submit a request to get a loan</p>
        </div>

        <form ref={form} class="book-form" onSubmit={sendEmail}>
          <div class="inputBox">
            <input type="text" name="user_name" placeholder="First & Last Name"/>
          </div>

          <div class="inputBox">
            <input type="email" name="user_email" placeholder=" Email" required/>
          </div>

          <div class="inputBox">
            <input type="text" name="user_link" placeholder="Link to the desired Land(decentraland) "/>
          </div>

          <div class="inputBox">
            <textarea name="user_message" placeholder="Add a Description" ></textarea>
          </div>

          <div class="inputBox">
            <input type="file" name="user_files" multiple="multiple"
            id="uploadFile"/>
          </div>

          <div class="inputBox">
            <input type="Submit"/>
          </div>
        </form>

      </section>
    )
}

export default ContactForm;