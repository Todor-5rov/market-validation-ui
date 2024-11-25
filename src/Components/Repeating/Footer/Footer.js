import React from 'react';
import { t } from 'i18next'; // Assuming you're using i18next for translation
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; 2024 {t("footer.text")}
      </p>
    </footer>
  );
};

export default Footer;
