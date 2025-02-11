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
  translateText,
} from "./productFunctions";
import { db, auth } from "../../FireBase/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Product.css";
import { ThreeDots } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Repeating/Sidenav/Sidenav";

// Define the base URL for API
const BASE_URL = "https://real-shepherd-excited.ngrok-free.app"; // Change this to your production API URL later

const Product = () => {
  const [businessDescription, setBusinessDescription] = useState("");
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [formUrls, setFormUrls] = useState({ formUrl: "", spreadsheetUrl: "" });
  const [googlePlacesQuery, setGooglePlacesQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [emailStatus, setEmailStatus] = useState(""); // For email status
  const [loading, setLoading] = useState(false); // General loading for survey generation
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Loading state for analysis refresh
  const [user, setUser] = useState(null); // To store the current user
  const [descriptions, setDescriptions] = useState([]); // List of descriptions
  const [selectedDescription, setSelectedDescription] = useState(null); // Currently selected description
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let subscriptionUnsubscribe;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); // Redirect if no user is logged in
      } else {
        setUser(currentUser); // Set the logged-in user

        // Fetch descriptions
        fetchDescriptions(
          currentUser.uid,
          setDescriptions,
          setPageLoading,
          setSelectedDescription
        );

        // Start subscription monitoring
        subscriptionUnsubscribe = checkSubscriptionStatus(
          currentUser.uid,
          navigate
        );
      }
    });

    return () => {
      unsubscribe(); // Clean up the auth listener
      if (subscriptionUnsubscribe) subscriptionUnsubscribe(); // Clean up subscription listener
    };
  }, []);

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
  }, [surveyQuestions]);

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
    <div
      className="feedback-app-container"
      data-testid="app-container"
      style={{ marginLeft: pageLoading ? 0 : 250 }}
    >
      {pageLoading ? (
        <div className="loading-container">
          <ThreeDots data-testid="three-dots-loading"/>
        </div>
      ) : (
        <div className="row">
          <div>
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
            />
          </div>
          <div className="feedback-form-container">
            <h1>{t("feedbackApp.title")}</h1>
            <div className="dropdown-container">
              <label htmlFor="description-dropdown">
                {t("feedbackApp.savedDescriptions")}
              </label>
            </div>
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
                }} // Direct call to handleGenerateSurvey
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
              }} // Direct call to handleAnalyzeFeedback
              disabled={isAnalyzing}
              className="analyze-button"
              data-testid="analyze-responses-btn"
            >
              {t("feedbackApp.analyzeResponses")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;