import React from "react";
import './ContactForm.css';



const ContactForm = () => {
    return (
        <section class="contacts" id="booking">

        <div class="title">
          <h2>Contact us</h2>
          <p>Submit a request to get a loan</p>
        </div>

        <form class="book-form">
          <div class="inputBox">
            <input type="text" name="name" placeholder="First & Last Name"/>
          </div>

          <div class="inputBox">
            <input type="email" name="email" placeholder=" Email" required/>
          </div>

          <div class="inputBox">
            <input type="text" name="name" placeholder="Link to the desired Land(decentraland) "/>
          </div>

          <div class="inputBox">
            <textarea name="description" placeholder="Add a Description" ></textarea>
          </div>

          <div class="inputBox">
            <input type="file" name="filefield" multiple="multiple"
            id="uploadFile"/>
          </div>

          <div class="inputBox">
            <input type="submit"/>
          </div>
        </form>

      </section>
    )
}

export default ContactForm;