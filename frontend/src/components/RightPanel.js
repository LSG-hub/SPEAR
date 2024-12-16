import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "./RightPanel.css";

function RightPanel({ color, response }) {
  const [isFlipped, setIsFlipped] = useState(false); // State to control flipping
  const [displayedText, setDisplayedText] = useState(""); // Text being typed

  useEffect(() => {
    let currentIndex = -1; // Start at -1 to handle the first character correctly
    let interval = null; // Reference to the interval for cleanup

    // Clear displayedText before typing a new response
    setDisplayedText("");

    if (response) {
      // Typing animation logic
      interval = setInterval(() => {
        if (currentIndex < response.length - 1) {
          // Increment index before appending the character to avoid "undefined"
          currentIndex++;
          setDisplayedText((prev) => prev + response[currentIndex]);
        } else {
          clearInterval(interval); // Stop the typing animation when done
        }
      }, 10); // Adjust typing speed (milliseconds per letter)
    }

    return () => clearInterval(interval); // Cleanup on unmount or response change
  }, [response]); // Re-run the effect whenever `response` changes

  const handleFlip = () => {
    setIsFlipped(!isFlipped); // Toggle flip state
  };

  return (
    <div className="right-panel-wrapper">
      <div
        className={`right-panel-container ${isFlipped ? "flipped" : ""}`}
        style={{ backgroundColor: color }} // Dynamically set container background
      >
        {/* Front Panel */}
        <div className="panel-face front">
          <div className="right-panel-header">
            <span>Header Title</span>
            <FontAwesomeIcon
              icon={faSyncAlt}
              className="flip-icon"
              onClick={handleFlip}
            />
          </div>
          <div className="right-panel-content">
            <h2>Backend Logic Panel</h2>
          </div>
        </div>

        {/* Back Panel */}
        <div
          className="panel-face back"
          style={{ backgroundColor: color }} // Dynamically set back panel background
        >
          <div className="right-panel-header">
            <span>Response</span>
            <FontAwesomeIcon
              icon={faSyncAlt}
              className="flip-icon"
              onClick={handleFlip}
            />
          </div>
          <div className="code-editor-container">
            <pre className="code-editor">
              <code>{displayedText || "No Response Yet."}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightPanel;
