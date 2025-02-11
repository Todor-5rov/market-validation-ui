import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleRegister, handleGoogleSignIn, handleLanguageChange } from "./registerFunctions";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="language-selector">
          <span className={`language-option ${i18n.language === "en" ? "active" : ""}`} onClick={() => handleLanguageChange("en", i18n)}>
            EN
          </span>
          <span className="separator">|</span>
          <span className={`language-option ${i18n.language === "bg" ? "active" : ""}`} onClick={() => handleLanguageChange("bg", i18n)}>
            BG
          </span>
        </div>
        <h2 className="register-title">{t("register.title")}</h2>
        <div className="input-group">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("register.emailPlaceholder")} className="register-input" />
        </div>
        <div className="input-group">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("register.passwordPlaceholder")} className="register-input" />
        </div>
        <div className="input-group">
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("register.confirmPasswordPlaceholder")} className="register-input" />
        </div>
        <button onClick={() => handleRegister(email, password, confirmPassword, setError, setMessage, navigate, t)} className="register-button">
          {t("register.registerButton")}
        </button>
        <div className="hr-text" data-content={t("register.or")}></div>
        <button onClick={() => handleGoogleSignIn(setError, navigate)} className="google-signin-button">
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