import React, { useRef, useState} from 'react';
import './ContactForm.css';
import emailsjs from "@emailjs/browser";
import Alert from '../Alert/Alert';




const ContactForm = ({alert, removeAlert}) => {
  const form = useRef();
  const [disabled, setDisabled] = useState(false);
  const [isCheckBox, setIsCheckBox] = useState(false);
  const handleClick = () => setDisabled(!disabled);


  const sendEmail = (e) => {
    e.preventDefault();

    emailsjs.sendForm("service_q0nfveq","template_rjc2l0k", form.current, "SueLEDML4gZNVsR2H")
            .then((result) => {
              console.log(result.text);
              removeAlert(true, "Thank you! MetaLoan will review your request and e-mail with more information to complete your loan.");
              e.target.reset();
            })
            .then((error)=> {
              console.log(error.text);
            });
  } 

    return (
        <section className="contacts" id="booking">
        <div className="title">
          <h1>Request a Loan</h1>
          <p>Complete this form to receive your custom loan plan</p>
        </div>

        <form ref={form} class="book-form" onSubmit={sendEmail}>
          <div className="inputBox">
            <input type="text" name="user_name" placeholder="First & Last Name" required/>
          </div>

          <div className="inputBox">
            <input type="email" name="user_email" placeholder=" Email" required/>
          </div>

          <div className="inputBox">
            <input type="text" name="user_link" placeholder="Link to the desired Land(Decentraland)" required/>
          </div>

          <div className="inputBox">
            <textarea name="user_message" placeholder="Anything else we should know" rows="10" required></textarea>
          </div>

          <div className="checkbox-container">
            <input type="checkbox" id="scales" 
                  name="user_checkbox" 
                  disabled={handleClick} 
                  value={isCheckBox ? 
                    " The user acknowledge that MetaLoan requires payment of 30% down payment before any purchase " : 
                    "The user didn't acknowledge that MetaLoan requires payment of 30% down payment before any purchase"}
                  onChange={()=> setIsCheckBox(!isCheckBox)}/>  
            <label for="user_checkbox">MetaLoan requires payment of a 30% down payment before any purchase. By submitting a request you acknowledge this requirement.</label>
          </div>

          <div className="inputBox">
            <input type="Submit"/>
          </div>
          <>
            {alert.show && <Alert {...alert} removeAlert={removeAlert} />}
          </>
        </form>
      </section>
    )
}

export default ContactForm;





/*

Hello {{to_name}},

You got a new message from {{user_name}}:

{{message}}

Link to the desired Land(Decentraland) : {{user_link}}

Email : {{user_email}}

Best wishes,
EmailJS team

*/