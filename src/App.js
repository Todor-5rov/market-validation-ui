import React, { useState, useEffect } from "react";
import "./App.css";
import SurveyResults from "./SurveyResults";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [submissionData, setSubmissionData] = useState(() => {
    const savedData = localStorage.getItem("submissionData");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save submission data (only spreadsheet URLs and related info) to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("submissionData", JSON.stringify(submissionData));
  }, [submissionData]);

  // Automatically call analyze responses on page load
  useEffect(() => {
    if (submissionData.length > 0) {
      handleAnalyzeResponses();
    }
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const messageExists = chatHistory.some((msg) => msg.includes(message));

      if (!messageExists) {
        setChatHistory([...chatHistory, `${message}`]);
        setMessage("");

        try {
          const agentResponse = await fetch(
            "http://localhost:5000/api/call_agent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ business_description: message }),
            }
          );

          if (!agentResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const agentData = await agentResponse.json();
          const formTitle = agentData.formTitle;
          const questions = agentData.questions;
          const googlePlacesQuery = agentData.googlePlacesQuery;

          const formResponse = await fetch(
            "http://localhost:5000/api/create_form",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ form_title: formTitle, questions }),
            }
          );

          if (!formResponse.ok) {
            throw new Error("Failed to create Google Form");
          }

          const formResult = await formResponse.json();
          const formUserUrl = String(formResult.formUrl).replace(
            "edit",
            "viewform"
          );
          const newSpreadsheetUrl = formResult.spreadsheetUrl;

          // Add new submission data to state (store only spreadsheet URL)
          setSubmissionData((prevData) => [
            ...prevData,
            { message, formTitle, spreadsheetUrl: newSpreadsheetUrl },
          ]);

          const emailsResponse = await fetch(
            "http://localhost:5000/api/get_business_emails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ googlePlacesQuery }),
            }
          );

          if (!emailsResponse.ok) {
            throw new Error("Failed to fetch business emails");
          }

          const emails = await emailsResponse.json();

          const emailResponse = await fetch(
            "http://localhost:5000/api/send_email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                recipients: emails,
                formUrl: formUserUrl,
              }),
            }
          );

          if (!emailResponse.ok) {
            throw new Error("Failed to send emails");
          }

          const emailResult = await emailResponse.json();
          console.log(emailResult);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.log("This description has already been processed.");
      }
    }
  };

  const handleAnalyzeResponses = async () => {
    setLoading(true);
    setError(null);

    try {
      const analysisPromises = submissionData.map(async (submission, index) => {
        if (!submission.spreadsheetUrl) {
          console.error("No spreadsheet URL available.");
          return submission;
        }

        const analysisResponse = await fetch(
          "https://script.google.com/macros/s/AKfycbwtJ8LBaFYxCzgOS0CCpJFCj1lrsnu3t6l5mxWql-d7YcRTUqu5KMPNjXWSOGJOPyNjnA/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: JSON.stringify({ spreadsheetUrl: submission.spreadsheetUrl }),
          }
        );

        if (!analysisResponse.ok) {
          throw new Error("Failed to analyze responses");
        }

        const analysisData = await analysisResponse.json();

        return { ...submission, analysis: analysisData };
      });

      const results = await Promise.all(analysisPromises);

      // Update the submission data with the analysis results (only in state, not in local storage)
      setSubmissionData(results);
    } catch (error) {
      console.error("Error during analysis:", error);
      setError("Error analyzing responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>ProVal</h1>
      <div className="chat-window">
        <div className="messages">
          {chatHistory.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a business description..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <div>
        <h2>Submissions</h2>
        <button onClick={handleAnalyzeResponses} disabled={loading}>
          Analyze Responses
        </button>
        {submissionData.length > 0 ? (
          <>
            {submissionData.map(
              (submission, index) =>
                submission.analysis && (
                  <SurveyResults
                    key={index}
                    analysisResults={submission.analysis}
                    formTitle={submission.formTitle}
                  />
                )
            )}
          </>
        ) : (
          <p>No submissions yet.</p>
        )}
        {loading && <p>Loading analysis...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;
