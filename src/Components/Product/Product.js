import React, { useState, useEffect } from "react";
import Footer from "../Repeating/Footer/Footer";
import Navbar from "../Repeating/Navbar/Navbar";
import axios from "axios";
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
import { getDoc, onSnapshot } from "firebase/firestore";

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
  const { t } = useTranslation();

  useEffect(() => {
    let subscriptionUnsubscribe;
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); // Redirect if no user is logged in
      } else {
        setUser(currentUser); // Set the logged-in user
  
        // Fetch descriptions
        fetchDescriptions(currentUser.uid);
  
        // Start subscription monitoring
        subscriptionUnsubscribe = checkSubscriptionStatus(
          currentUser.uid,
          navigate
        );
      }
    });
  
    // Cleanup both listeners on unmount
    return () => {
      unsubscribe(); // Clean up the auth listener
      if (subscriptionUnsubscribe) subscriptionUnsubscribe(); // Clean up subscription listener
    };
  }, []);

  const checkSubscriptionStatus = (userId, navigate) => {
    try {
      const userDocRef = doc(db, "subscriptions", userId);
      console.log("in");
      // Set up a real-time Firestore listener
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const subscriptionStatus = userData.subscriptionStatus;
  
          if (subscriptionStatus !== "trialing") {
            navigate("/pricing"); // Redirect if subscription is not active
          } else {
            navigate("/product");
          }
        } else {
          console.log("No subscription document found!");
          navigate("/pricing"); // Redirect if no subscription document exists
        }
      });
  
      return unsubscribe; // Return unsubscribe to clean up the listener
    } catch (error) {
      console.error("Error setting up subscription listener:", error);
      navigate("/pricing"); // Redirect on error
    }
  };

  useEffect(() => {
    if (surveyQuestions.length > 0) {
      handleCreateForm();
    }
  }, [surveyQuestions]);

  useEffect(() => {
    if (selectedDescription) {
      setBusinessDescription(selectedDescription.description);
      setFormUrls({
        formUrl: selectedDescription.formUrl,
        spreadsheetUrl: selectedDescription.spreadsheetUrl,
      });
      setAnalysis(selectedDescription.lastAnalysis || "");
    }
  }, [selectedDescription]);

  const fetchDescriptions = async (userId) => {
    try {
      const userDocRef = doc(db, "chatHistories", userId);
      const chatHistoryRef = collection(userDocRef, "chatHistory");
      const descriptionsSnapshot = await getDocs(
        query(chatHistoryRef, orderBy("timestamp", "desc"))
      );

      const fetchedDescriptions = descriptionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDescriptions(fetchedDescriptions);
      setTimeout(() => {
        setPageLoading(false);
      }, 500);

      // Automatically select the most recent description
      if (fetchedDescriptions.length > 0) {
        setSelectedDescription(fetchedDescriptions[0]);
      }
    } catch (error) {
      console.error("Error fetching descriptions:", error);
    }
  };

  const handleGenerateSurvey = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/call_agent`, {
        business_description: businessDescription,
      });

      const { questions, googlePlacesQuery } = response.data;
      setSurveyQuestions(questions);
      setGooglePlacesQuery(googlePlacesQuery);

      setLoading(false); // Stop loading once questions are loaded
    } catch (error) {
      console.error("Error generating survey:", error);
      setLoading(false); // Stop loading on error
    }
  };

  const handleCreateForm = async () => {
    if (!surveyQuestions.length) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/create_form`, {
        form_title: "Market Validation Survey",
        questions: surveyQuestions,
      });

      const { formUrl, spreadsheetUrl } = response.data;
      setFormUrls({ formUrl, spreadsheetUrl });

      // After form creation, send emails to the recipients
      handleSendEmails(formUrl);

      // Store form and spreadsheet links in Firestore
      saveToFirestore({
        description: businessDescription,
        formUrl,
        spreadsheetUrl,
      });
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleSendEmails = async (formUrl) => {
    if (!googlePlacesQuery) return; // Only send emails if a Google Places query is available

    try {
      // Create the view-only URL by replacing 'edit' with 'viewform'
      const viewFormUrl = formUrl.replace("edit", "viewform");

      const response = await axios.post(`${BASE_URL}/api/send_email`, {
        recipients: [googlePlacesQuery], // You can adjust this to send to the correct email list
        formUrl: viewFormUrl,
      });

      setEmailStatus(response.data.status);
    } catch (error) {
      console.error("Error sending emails:", error);
      setEmailStatus("Error sending emails");
    }
  };

  const handleAnalyzeFeedback = async () => {
    if (!formUrls.spreadsheetUrl) return;

    setAnalysis("Analyzing feedback... Please wait."); // Indicate loading state for analysis
    setIsAnalyzing(true); // Set analysis loading state

    try {
      const response = await axios.post(`${BASE_URL}/api/analyze_feedback`, {
        spreadsheetId: formUrls.spreadsheetUrl,
      });

      const { insights } = response.data;
      setAnalysis(insights);

      // Update Firestore with the analysis result
      updateAnalysisInFirestore(insights);
    } catch (error) {
      console.error("Error analyzing feedback:", error);
      setAnalysis("Error analyzing feedback. Please try again.");
    } finally {
      setIsAnalyzing(false); // Ensure loading stops after analysis
    }
  };

  const saveToFirestore = async ({ description, formUrl, spreadsheetUrl }) => {
    try {
      if (!user) throw new Error("No user is logged in.");

      const userDocRef = doc(db, "chatHistories", user.uid);
      const chatHistoryRef = collection(userDocRef, "chatHistory");

      // Fetch all documents in the chatHistory collection to count existing entries
      const chatHistorySnapshot = await getDocs(chatHistoryRef);
      const descriptionCount = chatHistorySnapshot.size;
      const newDescriptionId = `Description${descriptionCount + 1}`;

      const newDescriptionRef = doc(chatHistoryRef, newDescriptionId);
      await setDoc(newDescriptionRef, {
        description,
        formUrl,
        spreadsheetUrl,
        lastAnalysis: "", // Placeholder until analysis is performed
        timestamp: new Date().toISOString(),
      });
      fetchDescriptions(user.uid); // Refresh the descriptions list
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const updateAnalysisInFirestore = async (analysis) => {
    try {
      if (!user) throw new Error("No user is logged in.");

      const userDocRef = doc(db, "chatHistories", user.uid);
      const chatHistoryRef = collection(userDocRef, "chatHistory");

      // Query the most recent description document
      const recentDescriptionsQuery = query(
        chatHistoryRef,
        orderBy("timestamp", "desc")
      );
      const recentDescriptionsSnapshot = await getDocs(recentDescriptionsQuery);

      if (!recentDescriptionsSnapshot.empty) {
        const recentDescriptionDoc = recentDescriptionsSnapshot.docs[0];
        await updateDoc(recentDescriptionDoc.ref, {
          lastAnalysis: analysis,
        });
      }
    } catch (error) {
      console.error("Error updating analysis in Firestore:", error);
    }
  };

  const handleStartNewCampaign = () => {
    // Reset all states to clear the form
    setBusinessDescription("");
    setSurveyQuestions([]);
    setFormUrls({ formUrl: "", spreadsheetUrl: "" });
    setGooglePlacesQuery("");
    setAnalysis("");
    setSelectedDescription(null); // Reset the selected description
  };

  return (
    <div className="feedback-app-container">
      <Navbar />
      {pageLoading ? (
        // Display the loading spinner if pageLoading is true
        <div className="loading-container">
          <ThreeDots />
        </div>
      ) : (
        // Display the rest of the page content when pageLoading is false
        <div className="feedback-form-container">
          <h1>{t("feedbackApp.title")}</h1>
          <div className="dropdown-container">
            <label htmlFor="description-dropdown">
              {t("feedbackApp.savedDescriptions")}
            </label>
            <div className="dropdown-div">
              <select
                className="description-dropdown"
                id="description-dropdown"
                value={selectedDescription?.id || ""}
                size={5}
                onChange={(e) => {
                  if (e.target.value === "new-campaign") {
                    handleStartNewCampaign(); // Clear form for a new campaign
                  } else {
                    const selectedId = e.target.value;
                    const selectedDesc = descriptions.find(
                      (desc) => desc.id === selectedId
                    );
                    setSelectedDescription(selectedDesc); // Update selected description
                  }
                }}
              >
                <option value="new-campaign">
                  {t("feedbackApp.startNewCampaign")}
                </option>
                {descriptions.map((desc) => (
                  <option key={desc.id} value={desc.id}>
                    {desc.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-container">
            <textarea
              placeholder={t("feedbackApp.enterDescription")}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
            />
            <button
              onClick={handleGenerateSurvey}
              disabled={loading}
              className="generate-button"
            >
              {t("feedbackApp.generateSurvey")}
            </button>
          </div>
          {loading && (
            <p className="loading-text">
              <ThreeDots wrapperClass="threeDots" />
            </p>
          )}{" "}
          {/* For survey generation loading */}
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
            </p> // Loading text for analysis
          ) : (
            analysis && (
              <div className="analysis-container">
                <h3>{t("feedbackApp.feedbackAnalysis")}</h3>
                <p>{analysis}</p>
              </div>
            )
          )}
          {!loading && formUrls.formUrl && (
            <button
              onClick={handleAnalyzeFeedback}
              className="analyze-feedback-button"
            >
              {t("feedbackApp.analyzeResponses")}
            </button>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Product;
