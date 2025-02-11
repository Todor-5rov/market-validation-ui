import React from "react";
import "./About.css"; // Ensure this file contains the necessary styles
import { useTranslation, Trans } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <div className="navbar-container">
      </div>
      <div className="about-container">
        <main>
          <h1>{t("about.title")}</h1>

          <section className="about-introduction">
            <h2>{t("about.who_we_are.title")}</h2>
            <p>{t("about.who_we_are.content")}</p>
          </section>

          <section className="about-story">
            <h2>{t("about.our_story.title")}</h2>
            <p>{t("about.our_story.content")}</p>
          </section>

          <section className="about-mission">
            <h2>{t("about.mission_and_vision.title")}</h2>
            <p>{t("about.mission_and_vision.content")}</p>
          </section>

          <section className="about-values">
            <h2>{t("about.core_values.title")}</h2>
            <div className="values-cards">
              <div className="value-card">
                <h3>{t("about.core_values.values.integrity.title")}</h3>
                <p>{t("about.core_values.values.integrity.content")}</p>
              </div>
              <div className="value-card">
                <h3>{t("about.core_values.values.innovation.title")}</h3>
                <p>{t("about.core_values.values.innovation.content")}</p>
              </div>
              <div className="value-card">
                <h3>{t("about.core_values.values.community.title")}</h3>
                <p>{t("about.core_values.values.community.content")}</p>
              </div>
            </div>
          </section>

          <section className="about-why-us">
            <h2>{t("about.why_choose_us.title")}</h2>
            <p>{t("about.why_choose_us.content")}</p>
          </section>

          <section className="about-contact">
            <h2>{t("about.get_in_touch.title")}</h2>

            <Trans
              i18nKey="about.get_in_touch.content"
              components={{
                contactLink: <a href="/contact" className="about-contact-link"/>,
              }}
            />
          </section>
        </main>
      </div>
      <div className="footer-container">
      </div>
    </div>
  );
};

export default About;
