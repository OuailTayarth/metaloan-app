import React, { useRef, useState } from "react";
import "./ContactForm.css";
import emailsjs from "@emailjs/browser";
import Alert from "../Alert/Alert";
import { ContactFormProps } from "../../models/contactFormProps";

const ContactForm: React.FC<ContactFormProps> = ({ alert, removeAlert }) => {
  const form = useRef<HTMLFormElement | null>(null);
  const [isCheckBox, setIsCheckBox] = useState<boolean>(false);

  // Email credentials
  const serviceId = process.env.REACT_APP_EMAIL_SERVICE;
  const templateId = process.env.REACT_APP_EMAIL_TEMPLATE;
  const publicKey = process.env.REACT_APP_EMAIL_KEY;

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check for undefined values
    if (form.current && serviceId && templateId && publicKey) {
      emailsjs
        .sendForm(serviceId, templateId, form.current, publicKey)
        .then((result) => {
          console.log(result.text);
          removeAlert(
            true,
            "Thank you! MetaLoan will review your request and e-mail with more information to complete your loan."
          );
          (e.target as HTMLFormElement).reset();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <section className="contacts" id="requestloan">
      <div className="title">
        <h1>Request a Loan</h1>
        <p>Complete this form to receive your custom loan plan</p>
      </div>

      <form ref={form} className="book-form" onSubmit={sendEmail}>
        <div className="inputBox">
          <input
            type="text"
            name="user_name"
            placeholder="First & Last Name"
            required
          />
        </div>

        <div className="inputBox">
          <input type="email" name="user_email" placeholder=" Email" required />
        </div>

        <div className="inputBox">
          <input
            type="text"
            name="user_link"
            placeholder="Link to the desired Land(Decentraland)"
            required
          />
        </div>

        <div className="inputBox">
          <textarea
            name="user_message"
            placeholder="Anything else we should know"
            rows={10}
            required></textarea>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="scales"
            name="user_checkbox"
            value={
              isCheckBox
                ? " The user acknowledge that MetaLoan requires payment of 50% down payment before any purchase "
                : "The user didn't acknowledge that MetaLoan requires payment of 50% down payment before any purchase"
            }
            onChange={() => setIsCheckBox(!isCheckBox)}
          />
          <label htmlFor="user_checkbox">
            MetaLoan requires a down payment of up to 50% before any purchase.
            By submitting a request you acknowledge this requirement.
          </label>
        </div>

        <div className="inputBox">
          <input type="Submit" />
        </div>
        {alert && <Alert {...alert} removeAlert={removeAlert} />}
      </form>
    </section>
  );
};

export default ContactForm;
