import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
        setFormData({ name: "", email: "", message: "" }); // Clear form
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
    navigate("/home");
  };

  return { formData, submitted, error, handleChange, handleSubmit, handleGoHome, t };
};