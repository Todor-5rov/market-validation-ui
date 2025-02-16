import React, { useState, useEffect } from "react";
import {
  fetchDescriptions,
  saveToFirestore,
  updateAnalysisInFirestore,
  checkSubscriptionStatus,
  handleGenerateSurvey,
  handleCreateForm,
  handleSendEmails,
  handleAnalyzeFeedback,
} from "./productFunctions";
import { auth } from "../../FireBase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./Product.css";
import { ThreeDots } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Repeating/Sidenav/Sidenav";

const BASE_URL = "https://real-shepherd-excited.ngrok-free.app";

const Product = () => {
  const [businessDescription, setBusinessDescription] = useState("");
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [formUrls, setFormUrls] = useState({ formUrl: "", spreadsheetUrl: "" });
  const [googlePlacesQuery, setGooglePlacesQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let subscriptionUnsubscribe;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        fetchDescriptions(
          currentUser.uid,
          setDescriptions,
          setPageLoading,
          setSelectedDescription
        );
        subscriptionUnsubscribe = checkSubscriptionStatus(
          currentUser.uid,
          navigate
        );
      }
    });

    return () => {
      unsubscribe();
      if (subscriptionUnsubscribe) subscriptionUnsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (surveyQuestions.length > 0) {
      handleCreateForm(
        surveyQuestions,
        setFormUrls,
        handleSendEmails,
        saveToFirestore,
        businessDescription
      );
    }
  }, [surveyQuestions, businessDescription]);

  useEffect(() => {
    if (selectedDescription) {
      const lang = i18n.language;
      if (lang === "bg") {
        setBusinessDescription(selectedDescription.descriptionBG);
        setAnalysis(selectedDescription.lastAnalysisBG);
      } else {
        setBusinessDescription(selectedDescription.descriptionEN);
        setAnalysis(selectedDescription.lastAnalysisEN);
      }
    }
  }, [selectedDescription, i18n.language]);

  return (
    <div className="product-container">
      <Sidebar
        descriptions={descriptions}
        selectedDescription={selectedDescription}
        setSelectedDescription={setSelectedDescription}
        handleStartNewCampaign={() => {
          setBusinessDescription("");
          setSurveyQuestions([]);
          setFormUrls({ formUrl: "", spreadsheetUrl: "" });
          setGooglePlacesQuery("");
          setAnalysis("");
          setSelectedDescription(null);
        }}
        setDescriptions={setDescriptions}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div
        className={`feedback-app-container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
        data-testid="app-container"
      >
        {pageLoading ? (
          <div className="loading-container">
            <ThreeDots data-testid="three-dots-loading"/>
          </div>
        ) : (
          <div className="feedback-form-container">
            <h1>{t("feedbackApp.title")}</h1>
            <div className="input-container">
              <textarea
                placeholder={t("feedbackApp.enterDescription")}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              />
              <button
                onClick={() => {
                  setLoading(true);
                  handleGenerateSurvey(
                    businessDescription,
                    setSurveyQuestions,
                    setGooglePlacesQuery,
                    setLoading
                  );
                }}
                disabled={loading}
                className="generate-button"
                data-testid="generate-survey-btn"
              >
                {t("feedbackApp.generateSurvey")}
              </button>
            </div>
            {loading && (
              <p className="loading-text">
                <ThreeDots wrapperClass="threeDots" />
              </p>
            )}
            {formUrls.formUrl && (
              <div className="form-links">
                <h2>{t("feedbackApp.formCreated")}</h2>
                <p>
                  <a
                    href={formUrls.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("feedbackApp.viewForm")}
                  </a>
                </p>
                <p>
                  <a
                    href={formUrls.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("feedbackApp.viewResponsesSpreadsheet")}
                  </a>
                </p>
              </div>
            )}
            {isAnalyzing ? (
              <p className="loading-text">
                <ThreeDots wrapperClass="threeDots" />
              </p>
            ) : (
              analysis && (
                <div className="analysis-container">
                  <h3>{t("feedbackApp.feedbackAnalysis")}</h3>
                  <p className="analysis">{analysis}</p>
                </div>
              )
            )}
            <button
              onClick={() => {
                setIsAnalyzing(true);
                handleAnalyzeFeedback(
                  formUrls.spreadsheetUrl,
                  setAnalysis,
                  setIsAnalyzing,
                  updateAnalysisInFirestore
                );
              }}
              disabled={isAnalyzing}
              className="analyze-button"
              data-testid="analyze-responses-btn"
            >
              {t("feedbackApp.analyzeResponses")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;

