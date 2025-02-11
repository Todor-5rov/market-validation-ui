import React from "react";
import { t } from "i18next"; // Assuming you're using i18next for translation
import "./Footer.css";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isProductPage = location.pathname === "/product";

  return (
    <footer className={`footer ${isProductPage ? "shifted" : ""}`}>
      <p className="footer-text">&copy; 2024 {t("footer.text")}</p>
    </footer>
  );
};

export default Footer;