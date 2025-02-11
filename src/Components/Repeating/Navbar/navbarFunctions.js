import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../FireBase/firebaseConfig";

/**
 * Handles user authentication state change.
 */
export const handleAuthStateChange = (setUser, setLoading) => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });

  // Clean up the listener when the component unmounts
  return unsubscribe;
};

/**
 * Handles language change with a slight delay to manage loading state.
 */
export const handleLanguageChange = (lang, i18n, setLocaleLoading) => {
  setLocaleLoading(true);
  i18n.changeLanguage(lang);
  setTimeout(() => {
    setLocaleLoading(false);
  }, 500);
};