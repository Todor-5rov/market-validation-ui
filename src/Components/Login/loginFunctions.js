import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../../FireBase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (e) {
      setError(e.message);
    }
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

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    message,
    handleLogin,
    handleGoogleSignIn,
    handleForgotPassword,
    handleLanguageChange,
    navigate,
    t,
    i18n,
  };
};
