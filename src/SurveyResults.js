// src/SurveyResults.js

import React, { useState } from "react";
import "./SurveyResults.css";

const SurveyResults = ({ analysisResults, formTitle }) => {
  // State to manage the open/close status of the main survey results
  const [isSurveyOpen, setIsSurveyOpen] = useState(true);
  const [openIndices, setOpenIndices] = useState([]);

  // Check if analysis results are available
  if (!analysisResults || !analysisResults.success) {
    return <p>No analysis data available.</p>;
  }

  const { totalResponses, questionSummaries } = analysisResults.data;

  const toggleSurvey = () => {
    setIsSurveyOpen(!isSurveyOpen);
  };

  const toggleDropdown = (index) => {
    setOpenIndices((prevOpenIndices) => {
      if (prevOpenIndices.includes(index)) {
        return prevOpenIndices.filter((i) => i !== index);
      } else {
        return [...prevOpenIndices, index];
      }
    });
  };

  return (
    <div className="survey-results">
      <h2 onClick={toggleSurvey} className="survey-title">
        {formTitle} Analysis {isSurveyOpen ? "▲" : "▼"} {/* Updated to show form title with "Analysis" */}
      </h2>
      {isSurveyOpen && (
        <>
          <p>Total Responses: {totalResponses}</p>
          <div className="questions">
            {questionSummaries.map((summary, index) => (
              <QuestionSummary
                key={index}
                summary={summary}
                isOpen={openIndices.includes(index)}
                onToggle={() => toggleDropdown(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const QuestionSummary = ({ summary, isOpen, onToggle }) => {
  const { question, summary: responses } = summary;

  return (
    <div
      className={`question-summary ${isOpen ? "open" : ""}`}
      onClick={onToggle}
    >
      <div className="question-header">
        <h3>{question}</h3>
        <span className="toggle-indicator">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul className="responses">
          {Object.entries(responses).map(([response, count], index) => (
            <li key={index}>
              <strong>{response}</strong>: {count}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SurveyResults;
