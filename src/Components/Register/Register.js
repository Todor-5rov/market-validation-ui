import React, { useState } from "react";
import { auth, googleProvider } from "../../FireBase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {t, i18n} = useTranslation();
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError(t("register.errorPasswordMismatch"));
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage(t("register.successMessage"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setError(e.message);
    }
  };
  
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
      <div className="language-selector">
          <span
            className={`language-option ${
              i18n.language === "en" ? "active" : ""
            }`}
            onClick={() => handleLanguageChange("en")}
          >
            EN
          </span>
          <span className="separator">|</span>
          <span
            className={`language-option ${
              i18n.language === "bg" ? "active" : ""
            }`}
            onClick={() => handleLanguageChange("bg")}
          >
            BG
          </span>
        </div>
        <h2 className="register-title">{t("register.title")}</h2>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("register.emailPlaceholder")}
            className="register-input"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("register.passwordPlaceholder")}
            className="register-input"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("register.confirmPasswordPlaceholder")}
            className="register-input"
          />
        </div>
        <button onClick={handleRegister} className="register-button">
          {t("register.registerButton")}
        </button>
        <div className="hr-text" data-content={t("register.or")}></div>
        <button onClick={handleGoogleSignIn} className="google-signin-button">
          {t("register.googleSignInButton")}
        </button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <p>
          {t("register.alreadyHaveAccount")}{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            {t("register.loginLink")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;