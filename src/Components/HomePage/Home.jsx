import { useTranslation } from "react-i18next"
import "./Home.css"

const LandingPage = () => {
  const { t } = useTranslation()

  return (
    <div className="landing-page">

      <main className="main-content">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-heading">{t("home.hero.heading")}</h1>
            <h5 className="hero-subtitle">{t("home.hero.subtitle")}</h5>
          </div>
        </section>

        <section id="features" className="features">
          <h2 className="section-heading">{t("home.features.section_heading")}</h2>

          <div className="features-container">
            <div className="feature-card">
              <div className="feature">
                <div className="image-container">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/preview-SExsmTMJ8q5kTuCORoS3ll7jZCDTKJ.jpeg"
                    className="feature-image"
                    alt={t("home.features.automated_email_campaigns.title")}
                  />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">{t("home.features.automated_email_campaigns.title")}</h3>
                  <p className="feature-description">{t("home.features.automated_email_campaigns.description")}</p>
                </div>
              </div>
            </div>

            <div className="feature-card-middle">
              <div className="feature reversed">
                <div className="image-container">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/insights.png-8JaJ3vAHPGfkDQQUzVhLs6OPtOUzE2.webp"
                    className="feature-image-mid"
                    alt={t("home.features.actionable_insights.title")}
                  />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">{t("home.features.actionable_insights.title")}</h3>
                  <p className="feature-description">{t("home.features.actionable_insights.description")}</p>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature">
                <div className="image-container">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/data-tmmwLyaCfxSTJ926EhTf2R4AFu9asB.png"
                    className="feature-image"
                    alt={t("home.features.seamless_data_collection.title")}
                  />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">{t("home.features.seamless_data_collection.title")}</h3>
                  <p className="feature-description">{t("home.features.seamless_data_collection.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage;
