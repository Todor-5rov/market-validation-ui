import React, { useState } from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";
// Import your Navbar component
import Navbar from "../Repeating/Navbar/Navbar";
import Footer from "../Repeating/Footer/Footer";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://real-shepherd-excited.ngrok-free.app/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submitted:", formData);
        setSubmitted(true);
        // Clear form after submission
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        const errorResponse = await response.json();
        console.error("Error submitting form:", errorResponse);
        setError(t("contact.messages.error"));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(t("contact.messages.error"));
    }
  };

  const handleGoHome = () => {
    navigate("/home"); // Adjust the path as needed
  };

  return (
    <div className="wrapper">
      <Navbar />
      <div className="contact-container">
        {!submitted ? (
          <>
            <h2>{t("contact.title")}</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t("contact.form.name.label")}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t("contact.form.email.label")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t("contact.form.message.label")}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
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
      <Footer />
    </div>
  );
};

export default Contact;
