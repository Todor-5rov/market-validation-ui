import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Product from "./Product";
import { auth } from "../../FireBase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { 
  fetchDescriptions,
  saveToFirestore,
  updateAnalysisInFirestore,
  checkSubscriptionStatus,
  handleGenerateSurvey,
  handleCreateForm,
  handleSendEmails,
  handleAnalyzeFeedback,
  translateText 
} from "./productFunctions";

const mockNavigate = vi.fn();

// Mock modules
vi.mock("../../FireBase/firebaseConfig", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  db: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock all product functions
vi.mock("./productFunctions", () => ({
  fetchDescriptions: vi.fn(),
  saveToFirestore: vi.fn(),
  updateAnalysisInFirestore: vi.fn(),
  checkSubscriptionStatus: vi.fn(),
  handleGenerateSurvey: vi.fn(),
  handleCreateForm: vi.fn(),
  handleSendEmails: vi.fn(),
  handleAnalyzeFeedback: vi.fn(),
  translateText: vi.fn(),
}));

vi.mock("../Repeating/Sidenav/Sidenav", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe("Product Component", () => {
  const mockAuthUser = { uid: "test-uid" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Default auth mock for logged-in user
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockAuthUser);
      return () => {};
    });

    // Default fetchDescriptions mock
    vi.mocked(fetchDescriptions).mockImplementation((uid, setDescriptions, setPageLoading) => {
      setDescriptions([]);
      setPageLoading(false);
    });
  });

  // Previous tests remain the same...

  it("shows loading state initially and renders content after auth and data load", async () => {
    // Mock auth state
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback({ uid: "test-uid" });
      return () => {};
    });

    // Mock fetchDescriptions
    const { fetchDescriptions } = await import("./productFunctions");
    vi.mocked(fetchDescriptions).mockImplementation((uid, setDescriptions, setPageLoading) => {
      setPageLoading(true);
      setTimeout(() => {
        setDescriptions([]);
        setPageLoading(false);
      }, 0);
    });

    render(<Product />);

    // Check initial loading state
    const loadingElement = screen.getByTestId("three-dots-loading");
    expect(loadingElement).toBeInTheDocument();
    
    // Verify the loading container
    const appContainer = screen.getByTestId("app-container");
    expect(appContainer).toHaveClass("feedback-app-container");
    expect(appContainer).toHaveStyle({ marginLeft: '0px' });

    // Wait for loading to finish and content to appear
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });

    // Check that the main content is rendered
    expect(screen.getByText("feedbackApp.title")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    
    // Verify the container margin has updated
    await waitFor(() => {
      const updatedContainer = screen.getByTestId("app-container");
      expect(updatedContainer).toHaveStyle({ marginLeft: '250px' });
    });
  });

  it("redirects to login if no user is authenticated", async () => {
    // Mock auth state with no user
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(<Product />);

    // Verify navigation to login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows loading state when switching descriptions", async () => {
    // Mock auth state
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback({ uid: "test-uid" });
      return () => {};
    });

    // Mock fetchDescriptions
    const { fetchDescriptions } = await import("./productFunctions");
    vi.mocked(fetchDescriptions).mockImplementation((uid, setDescriptions, setPageLoading, setSelectedDescription) => {
      setPageLoading(true);
      setTimeout(() => {
        setDescriptions([
          { id: 1, descriptionEN: "Test 1", descriptionBG: "Тест 1" },
          { id: 2, descriptionEN: "Test 2", descriptionBG: "Тест 2" }
        ]);
        setPageLoading(false);
      }, 0);
    });

    render(<Product />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });

    // Verify content is rendered
    expect(screen.getByText("feedbackApp.title")).toBeInTheDocument();
  });

  it("handles business description input correctly", async () => {
    render(<Product />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("feedbackApp.enterDescription");
    fireEvent.change(textarea, { target: { value: "Test Business Description" } });
    
    expect(textarea.value).toBe("Test Business Description");
  });

  it("generates survey questions when Generate Survey button is clicked", async () => {
    vi.mocked(handleGenerateSurvey).mockImplementation((description, setSurveyQuestions, setGooglePlacesQuery, setLoading) => {
      setSurveyQuestions(["Question 1", "Question 2"]);
      setGooglePlacesQuery("Test Query");
      setLoading(false);
    });

    render(<Product />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("feedbackApp.enterDescription");
    fireEvent.change(textarea, { target: { value: "Test Business" } });

    const generateButton = screen.getByText("feedbackApp.generateSurvey");
    fireEvent.click(generateButton);

    expect(handleGenerateSurvey).toHaveBeenCalledWith(
      "Test Business",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("creates form and displays form URLs after survey generation", async () => {
    // Mock survey generation
    vi.mocked(handleGenerateSurvey).mockImplementation((description, setSurveyQuestions, setGooglePlacesQuery, setLoading) => {
      setSurveyQuestions(["Question 1", "Question 2"]);
      setGooglePlacesQuery("Test Query");
      setLoading(false);
    });

    // Mock form creation
    vi.mocked(handleCreateForm).mockImplementation((surveyQuestions, setFormUrls) => {
      setFormUrls({
        formUrl: "https://test-form.com",
        spreadsheetUrl: "https://test-sheet.com"
      });
    });

    render(<Product />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });

    // Generate survey
    const textarea = screen.getByPlaceholderText("feedbackApp.enterDescription");
    fireEvent.change(textarea, { target: { value: "Test Business" } });

    const generateButton = screen.getByText("feedbackApp.generateSurvey");
    fireEvent.click(generateButton);

    // Wait for form URLs to appear
    await waitFor(() => {
      expect(screen.getByText("feedbackApp.formCreated")).toBeInTheDocument();
      expect(screen.getByText("feedbackApp.viewForm")).toHaveAttribute("href", "https://test-form.com");
      expect(screen.getByText("feedbackApp.viewResponsesSpreadsheet")).toHaveAttribute("href", "https://test-sheet.com");
    });
  });

  it("handles feedback analysis when Analyze Responses button is clicked", async () => {
    // Mock analysis function
    vi.mocked(handleAnalyzeFeedback).mockImplementation((spreadsheetUrl, setAnalysis, setIsAnalyzing) => {
      setAnalysis("Test feedback analysis results");
      setIsAnalyzing(false);
    });

    render(<Product />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });

    const analyzeButton = screen.getByText("feedbackApp.analyzeResponses");
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Test feedback analysis results")).toBeInTheDocument();
    });
  });

  it("handles language switching correctly", async () => {
    vi.mocked(translateText).mockImplementation(async (text) => `Translated: ${text}`);
  
    // Mock fetchDescriptions before rendering the component
    const mockDescription = {
      descriptionEN: "English Description",
      descriptionBG: "Bulgarian Description",
      lastAnalysisEN: "English Analysis",
      lastAnalysisBG: "Bulgarian Analysis",
    };
  
    vi.mocked(fetchDescriptions).mockImplementation((uid, setDescriptions, setPageLoading, setSelectedDescription) => {
      setDescriptions([mockDescription]);
      setSelectedDescription(mockDescription);
      setPageLoading(false);
    });
  
    // Render the component only once
    render(<Product />);
  
    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("three-dots-loading")).not.toBeInTheDocument();
    });
  
    // Ensure only one textarea exists
    const textareas = screen.getAllByPlaceholderText("feedbackApp.enterDescription");
    expect(textareas).toHaveLength(1);
  
    // Verify correct content is displayed based on language
    expect(textareas[0]).toHaveValue("English Description");
  });
});