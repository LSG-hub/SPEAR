const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require('openai');
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

// Routes
app.post("/generate-code", async (req, res) => {
  const { prompt } = req.body; // Extract the 'prompt' from the request body

  console.log(`Received prompt: ${prompt}`); // Log the prompt to the server console

  try {
    // Send prompt to OpenAI GPT-3.5
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // GPT-3.5 model
      messages: [
        { role: "user", content: prompt }
      ], // New chat-based API format
      max_tokens: 150, // Limit the response length
      temperature: 0.7, // Control randomness
    });

    const gptResponse = completion.choices[0].message.content.trim(); // Access the response content

    console.log(`GPT-3.5 Turbo Response: ${gptResponse}`); // Log the response to terminal

    // Send the GPT response back to the frontend
    res.json({message: gptResponse});
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    res.status(500).json({ error: "Failed to communicate with OpenAI" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
