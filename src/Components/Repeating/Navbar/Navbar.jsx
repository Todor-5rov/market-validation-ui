import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleAuthStateChange, handleLanguageChange } from "./navbarFunctions";
import { ThreeDots } from "react-loader-spinner";
import PfpDropdown from "../PfpDropdown/PfpDropdown";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [localeLoading, setLocaleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // to get the current path

  useEffect(() => {
    // Initialize authentication state change listener
    const unsubscribe = handleAuthStateChange(setUser, setLoading);

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => navigate("/login");
  const handleGoAbout = () => navigate("/about");
  const handleGoProduct = () => navigate("/product");
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

  // Helper function to check if the current path matches a given path
  const isActive = (path) => location.pathname === path;

  return (
    <>
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
              onClick={() => handleLanguageChange("en", i18n, setLocaleLoading)}
            >
              EN
            </span>
            <span className="separator">|</span>
            <span
              className={`language-option ${
                i18n.language === "bg" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("bg", i18n, setLocaleLoading)}
            >
              BG
            </span>
          </div>

          {/* Other Navbar Links */}
          <a
            onClick={handleGoHome}
            className={isActive("/home") ? "active-link" : ""}
          >
            {t("navbar.home")}
          </a>
          <a
            onClick={handleGoProduct}
            className={isActive("/product") ? "active-link" : ""}
          >
            {t("navbar.product")}
          </a>
          <a
            onClick={handleGoAbout}
            className={isActive("/about") ? "active-link" : ""}
          >
            {t("navbar.about")}
          </a>
          <a
            onClick={handleGoContact}
            className={isActive("/contact") ? "active-link" : ""}
          >
            {t("navbar.contact")}
          </a>
          <a
            onClick={handleGoPricing}
            className={isActive("/pricing") ? "active-link" : ""}
          >
            {t("navbar.pricing")}
          </a>
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
    </>
  );
};

export default Navbar;
