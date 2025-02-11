import axios from "axios";
import { db, auth } from "../../FireBase/firebaseConfig";
import { collection, doc, setDoc, getDocs, query, orderBy, updateDoc, onSnapshot } from "firebase/firestore";

// Base URL for API calls
const BASE_URL = "https://real-shepherd-excited.ngrok-free.app";

/** ========== FIREBASE HELPERS ========== **/
export const fetchDescriptions = async (userId, setDescriptions, setPageLoading, setSelectedDescription) => {
  try {
    const userDocRef = doc(db, "chatHistories", userId);
    const chatHistoryRef = collection(userDocRef, "chatHistory");
    const descriptionsSnapshot = await getDocs(query(chatHistoryRef, orderBy("timestamp", "desc")));

    const fetchedDescriptions = descriptionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setDescriptions(fetchedDescriptions);
    setTimeout(() => setPageLoading(false), 500);

    if (fetchedDescriptions.length > 0) {
      setSelectedDescription(fetchedDescriptions[0]);
    }
  } catch (error) {
    console.error("Error fetching descriptions:", error);
  }
};

export const saveToFirestore = async (user, description, formUrl, spreadsheetUrl, fetchDescriptions) => {
  try {
    if (!user) throw new Error("No user is logged in.");

    const [translatedDescriptionEN, translatedDescriptionBG] = await Promise.all([
      translateText(description, "en"),
      translateText(description, "bg"),
    ]);

    const userDocRef = doc(db, "chatHistories", user.uid);
    const chatHistoryRef = collection(userDocRef, "chatHistory");

    const chatHistorySnapshot = await getDocs(chatHistoryRef);
    const newDescriptionId = `Description${chatHistorySnapshot.size + 1}`;
    const newDescriptionRef = doc(chatHistoryRef, newDescriptionId);

    await setDoc(newDescriptionRef, {
      descriptionEN: translatedDescriptionEN,
      descriptionBG: translatedDescriptionBG,
      formUrl,
      spreadsheetUrl,
      lastAnalysisEN: "",
      lastAnalysisBG: "",
      timestamp: new Date().toISOString(),
    });

    fetchDescriptions(user.uid);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
};

export const updateAnalysisInFirestore = async (user, analysis) => {
  try {
    if (!user) throw new Error("No user is logged in.");

    const userDocRef = doc(db, "chatHistories", user.uid);
    const chatHistoryRef = collection(userDocRef, "chatHistory");

    const recentDescriptionsSnapshot = await getDocs(query(chatHistoryRef, orderBy("timestamp", "desc")));
    if (!recentDescriptionsSnapshot.empty) {
      const recentDescriptionDoc = recentDescriptionsSnapshot.docs[0];

      const [translatedAnalysisEN, translatedAnalysisBG] = await Promise.all([
        translateText(analysis, "en"),
        translateText(analysis, "bg"),
      ]);

      await updateDoc(recentDescriptionDoc.ref, {
        lastAnalysisEN: translatedAnalysisEN,
        lastAnalysisBG: translatedAnalysisBG,
      });
    }
  } catch (error) {
    console.error("Error updating analysis in Firestore:", error);
  }
};

export const checkSubscriptionStatus = (userId, navigate) => {
  try {
    const userDocRef = doc(db, "subscriptions", userId);
    return onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const subscriptionStatus = docSnap.data().subscriptionStatus;
        if (subscriptionStatus !== "trialing") {
          navigate("/pricing");
        }
      } else {
        navigate("/pricing");
      }
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    navigate("/pricing");
  }
};

/** ========== API HELPERS ========== **/
export const handleGenerateSurvey = async (businessDescription, setSurveyQuestions, setGooglePlacesQuery, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.post(`${BASE_URL}/api/call_agent`, { business_description: businessDescription });
    setSurveyQuestions(response.data.questions);
    setGooglePlacesQuery(response.data.googlePlacesQuery);
  } catch (error) {
    console.error("Error generating survey:", error);
  }
  setLoading(false);
};

export const handleCreateForm = async (surveyQuestions, setFormUrls, handleSendEmails, saveToFirestore, businessDescription) => {
  if (!surveyQuestions.length) return;
  try {
    const response = await axios.post(`${BASE_URL}/api/create_form`, { form_title: "Market Validation Survey", questions: surveyQuestions });
    const { formUrl, spreadsheetUrl } = response.data;
    setFormUrls({ formUrl, spreadsheetUrl });

    handleSendEmails(formUrl);
    saveToFirestore(businessDescription, formUrl, spreadsheetUrl);
  } catch (error) {
    console.error("Error creating form:", error);
  }
};

export const handleSendEmails = async (formUrl, googlePlacesQuery, setEmailStatus) => {
  if (!googlePlacesQuery) return;
  try {
    const viewFormUrl = formUrl.replace("edit", "viewform");
    const response = await axios.post(`${BASE_URL}/api/send_email`, { recipients: [googlePlacesQuery], formUrl: viewFormUrl });
    setEmailStatus(response.data.status);
  } catch (error) {
    console.error("Error sending emails:", error);
    setEmailStatus("Error sending emails");
  }
};

export const handleAnalyzeFeedback = async (spreadsheetUrl, setAnalysis, setIsAnalyzing, updateAnalysisInFirestore) => {
  if (!spreadsheetUrl) return;
  
  setAnalysis("Analyzing feedback... Please wait.");
  setIsAnalyzing(true);

  try {
    const response = await axios.post(`${BASE_URL}/api/analyze_feedback`, { spreadsheetId: spreadsheetUrl });
    const insights = response.data.insights;
    setAnalysis(insights);
    updateAnalysisInFirestore(insights);
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    setAnalysis("Error analyzing feedback. Please try again.");
  }
  setIsAnalyzing(false);
};

/** ========== TRANSLATION HELPER ========== **/
export const translateText = async (text, targetLanguage) => {
  try {
    const endpoint = targetLanguage === "bg" ? "/api/translate_to_bg" : "/api/translate_to_en";
    const response = await axios.post(`${BASE_URL}${endpoint}`, { text });
    return response.data;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};
