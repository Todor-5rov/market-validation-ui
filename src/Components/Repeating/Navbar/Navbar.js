import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../FireBase/firebaseConfig"; // Adjust import path if necessary
import { useTranslation } from "react-i18next";
import "./Navbar.css"; // Ensure you create this CSS file
import PfpDropdown from "../PfpDropdown/PfpDropdown";
import { ThreeDots } from "react-loader-spinner";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [localeLoading, setLocaleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (lang) => {
    setLocaleLoading(true);
    i18n.changeLanguage(lang);
    setTimeout(()=>{setLocaleLoading(false)},1000);
    
  };

  const handleSignIn = () => navigate("/login");
  const handleGoAbout = () => navigate("/about");
  const handleGoProduct = () => navigate("/Product");
  const handleGoContact = () => navigate("/contact");
  const handleGoHome = () => navigate("/home");
  const handleGoPricing = () => navigate("/pricing");

  if (localeLoading) {
    return (
      <div className="locale-loading-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <nav className="navbar">
      <h1 className="app-title">
        <span className="pro">P</span>
        <span className="pro-small">ro</span>
        <span className="val">Val</span>
      </h1>
      <div className="navbar-links">
        {/* Language Selector */}
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

        {/* Other Navbar Links */}
        <a onClick={handleGoHome}>{t("navbar.home")}</a>
        <a onClick={handleGoProduct}>{t("navbar.product")}</a>
        <a onClick={handleGoAbout}>{t("navbar.about")}</a>
        <a onClick={handleGoContact}>{t("navbar.contact")}</a>
        <a onClick={handleGoPricing}>{t("navbar.pricing")}</a>
        <a>
          {user ? (
            <PfpDropdown />
          ) : (
            <button onClick={handleSignIn} className="sign-in-button">
              {t("navbar.signIn")}
            </button>
          )}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
