import { auth, googleProvider } from "../../FireBase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

/**
 * Handles user registration using email and password.
 */
export const handleRegister = async (email, password, confirmPassword, setError, setMessage, navigate, t) => {
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

/**
 * Handles Google Sign-In authentication.
 */
export const handleGoogleSignIn = async (setError, navigate) => {
  try {
    await signInWithPopup(auth, googleProvider);
    navigate("/home");
  } catch (e) {
    setError(e.message);
  }
};

/**
 * Handles language change for translations.
 */
export const handleLanguageChange = (lang, i18n) => {
  i18n.changeLanguage(lang);
};
