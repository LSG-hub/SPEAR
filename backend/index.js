const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const { PromptTemplate } = require("@langchain/core/prompts"); // LangChain import
require("dotenv").config(); // Load .env file

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON requests

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});

// LangChain PromptTemplate
const codingPrompt = PromptTemplate.fromTemplate(`
  This is the user prompt: "{userprompt}"
  You are a coding engine. If the given prompt is about coding, write the code for it in React.
  Write "App.js" for the Frontend and "index.js" for the Backend.

  Respond strictly in JSON format:
  {{
    "Frontend Response": "<code for frontend>",
    "Backend Response": "<code for backend>"
  }}
`);

// Routes
app.post("/generate-code", async (req, res) => {
  const { prompt } = req.body; // Extract the 'prompt' from the request body

  console.log(`Received prompt: ${prompt}`); // Log the prompt to the server console

  try {
    // Format the prompt using LangChain
    const formattedPrompt = await codingPrompt.format({ userprompt: prompt });

    // Send formatted prompt to OpenAI GPT-3.5
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: formattedPrompt }],
      max_tokens: 700, // Increase response length
      temperature: 0.7, // Control randomness
    });

    const gptResponse = completion.choices[0].message.content.trim(); // Access the response content

    console.log(`GPT-3.5 Turbo Response: ${gptResponse}`); // Log the response to terminal

    // Parse the response into JSON
    const parsedResponse = JSON.parse(gptResponse);

    const frontendResponse = parsedResponse["Frontend Response"] || "No Frontend Response";
    const backendResponse = parsedResponse["Backend Response"] || "No Backend Response";

    // Send the structured responses back to the frontend
    res.json({
      message: gptResponse, // Keep the original response
      leftPanelCode: frontendResponse, // Frontend code for Left Panel
      rightPanelCode: backendResponse, // Backend code for Right Panel
    });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
