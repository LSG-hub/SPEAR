import axios from "axios";
import React, { useState } from "react";
import "./App.css";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
  // State to manage the selected theme
  const [theme, setTheme] = useState("theme1");
  const [prompt, setPrompt] = useState(""); // State to handle user prompt
  const [leftPanelResponse, setLeftPanelResponse] = useState(""); // State for Frontend response
  const [rightPanelResponse, setRightPanelResponse] = useState(""); // State for Backend response

  // Theme combinations
  const themes = {
    theme1: {
      body: "#f5f5f5",
      header: "#ffffff",
      leftPanel: "#e3f2fd",
      rightPanel: "#f1f8e9",
    },
    theme2: {
      body: "#e0e0e0",
      header: "#d6d6d6",
      leftPanel: "#cfd8dc",
      rightPanel: "#d7ccc8",
    },
    theme3: {
      body: "#ffffff",
      header: "#f7f7f7",
      leftPanel: "#64b5f6",
      rightPanel: "#81c784",
    },
    theme4: {
      body: "#121212",
      header: "#212121",
      leftPanel: "#263238",
      rightPanel: "#37474f",
    },
    theme5: {
      body: "#f0f4c3",
      header: "#dce775",
      leftPanel: "#dcedc8",
      rightPanel: "#ffccbc",
    },
    theme6: {
      body: "#f3e5f5",
      header: "#e1bee7",
      leftPanel: "#bbdefb",
      rightPanel: "#c8e6c9",
    },
    theme7: {
      body: "#212121",
      header: "#424242",
      leftPanel: "#1e88e5",
      rightPanel: "#43a047",
    },
    theme8: {
      body: "#fff8e1",
      header: "#ffecb3",
      leftPanel: "#ffe0b2",
      rightPanel: "#ffccbc",
    },
    theme9: {
      body: "#e3f2fd",
      header: "#90caf9",
      leftPanel: "#bbdefb",
      rightPanel: "#c8e6c9",
    },
    theme10: {
      body: "#f1f8e9",
      header: "#aed581",
      leftPanel: "#8bc34a",
      rightPanel: "#689f38",
    },
  };

  // Handle theme change
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  // Handle prompt change
  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  // Handle prompt submission
  const handlePromptSubmit = async () => {
    if (prompt.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:5000/generate-code", { prompt });
        console.log("API Response:", response.data); // Debug the full response

        // Update LeftPanel and RightPanel responses
        setLeftPanelResponse(response.data.leftPanelCode); // Frontend code
        setRightPanelResponse(response.data.rightPanelCode); // Backend code

        setPrompt(""); // Clear the input box after submission
      } catch (error) {
        console.error("Error sending prompt:", error);
        setLeftPanelResponse("An error occurred while fetching the frontend response.");
        setRightPanelResponse("An error occurred while fetching the backend response.");
      }
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or page reload
      handlePromptSubmit();
    }
  };

  // Apply the selected theme
  const selectedTheme = themes[theme];

  return (
    <div
      style={{
        backgroundColor: selectedTheme.body,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header */}
      <header
        className="header"
        style={{
          backgroundColor: selectedTheme.header,
          transition: "background-color 0.3s ease",
        }}
      >
        <h1>S.P.E.A.R</h1>
        <input
          type="text"
          className="prompt-input"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
        />
        <select
          className="theme-dropdown"
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="theme1">Serene Sky</option>
          <option value="theme2">Urban Neutral</option>
          <option value="theme3">Vibrant Horizon</option>
          <option value="theme4">Night Mode</option>
          <option value="theme5">Morning Glow</option>
          <option value="theme6">Pastel Dreams</option>
          <option value="theme7">Tech Edge</option>
          <option value="theme8">Golden Sunset</option>
          <option value="theme9">Ocean Breeze</option>
          <option value="theme10">Forest Harmony</option>
        </select>
      </header>

      {/* Main Container */}
      <div className="container">
        <LeftPanel color={selectedTheme.leftPanel} response={leftPanelResponse || "Frontend code will appear here..."} />
        <RightPanel color={selectedTheme.rightPanel} response={rightPanelResponse || "Backend code will appear here..."} />
      </div>
    </div>
  );
}

export default App;
