import React from "react";
import "./Contact.css";
import Navbar from "../Repeating/Navbar/Navbar";
import Footer from "../Repeating/Footer/Footer";
import { useContactForm } from "./contactFunctions";

const Contact = () => {
  const { formData, submitted, error, handleChange, handleSubmit, handleGoHome, t } = useContactForm();

  return (
    <div className="wrapper">
      <div className="contact-container">
        {!submitted ? (
          <>
            <h2>{t("contact.title")}</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="contact-form" onSubmit={handleSubmit} role="form">
              <div className="form-group">
                <label htmlFor="name">{t("contact.form.name.label")}</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t("contact.form.email.label")}</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t("contact.form.message.label")}</label>
                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="contact-btn">
                {t("contact.form.submit_button")}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <p>{t("contact.messages.success")}</p>
            <button className="contact-btn" onClick={handleGoHome}>
              {t("contact.buttons.home")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
