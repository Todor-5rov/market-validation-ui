import React, { useState } from "react";
import "./Home.css"; // Make sure to style this CSS file
import previewImage from "./Images/preview.jpeg";
import dataImage from "./Images/data.png";
import insightsImage from "./Images/insights.png";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <div className="landing-page">
      <header className="header">
      </header>
      <main className="main-content">
        <section className="hero">
          <h1 className="hero-heading">{t("home.hero.heading")}</h1>
          <h5 className="hero-subtitle">{t("home.hero.subtitle")}</h5>
        </section>

        <section id="features" className="features">
          <h2 className="section-heading">
            {t("home.features.section_heading")}
          </h2>

          <div className="feature-card">
            <div className="feature">
              <img
                src={previewImage}
                className="email-image"
                alt={t("home.features.automated_email_campaigns.title")}
              />
              <div className="feature-text">
                <h3 className="feature-title">
                  {t("home.features.automated_email_campaigns.title")}
                </h3>
                <p className="feature-description">
                  {t("home.features.automated_email_campaigns.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="feature-card-middle">
            <div className="feature reversed">
              <img
                src={insightsImage}
                className="email-image-middle"
                alt={t("home.features.actionable_insights.title")}
              />
              <div className="feature-text">
                <h3 className="feature-title">
                  {t("home.features.actionable_insights.title")}
                </h3>
                <p className="feature-description">
                  {t("home.features.actionable_insights.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature">
              <img
                src={dataImage}
                className="email-image"
                alt={t("home.features.seamless_data_collection.title")}
              />
              <div className="feature-text">
                <h3 className="feature-title">
                  {t("home.features.seamless_data_collection.title")}
                </h3>
                <p className="feature-description">
                  {t("home.features.seamless_data_collection.description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
