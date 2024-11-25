import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../../FireBase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";
import { useTranslation } from "react-i18next";
import "react-i18next"
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to home page after login
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError(t("login.forgot_password_error"));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(t("login.password_reset_success"));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
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
        <h2 className="login-title">{t("login.title")}</h2>
        <div className="login-input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.email_placeholder")}
            className="login-input"
          />
        </div>
        <div className="login-input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.password_placeholder")}
            className="login-input"
          />
        </div>
        <button onClick={handleLogin} className="login-button">
          {t("login.login_button")}
        </button>
        <hr className="login-hr-text" data-content={t("login.or")}></hr>
        <button
          onClick={handleGoogleSignIn}
          className="login-google-signin-button"
        >
          {t("login.google_signin_button")}
        </button>
        {error && <p className="login-error-message">{error}</p>}
        {message && <p className="login-success-message">{message}</p>}
        <p className="login-forgot-password" onClick={handleForgotPassword}>
          {t("login.forgot_password")}
        </p>
        <p>
          {t("login.no_account")}{" "}
          <span
            className="login-register-link"
            onClick={() => navigate("/register")}
          >
            {t("login.register_link")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
