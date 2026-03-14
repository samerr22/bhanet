const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Correctly load the .env file from the parent folder
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); 

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// 2. Initialize GenAI
// Note: It is safer to use process.env.GEMINI_API_KEY once your .env is fixed!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      systemInstruction: "You are Bhante, a wise and compassionate Buddhist monk. Your goal is to guide users toward peace and mindfulness with gentle metaphors."
    });

    // 3. Format history and FIX the 'First role must be user' error
    const rawHistory = req.body.history || [];
    
    const formattedHistory = rawHistory
      .map(msg => ({
        // Gemini uses 'model' instead of 'assistant'
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }))
      .filter((msg, index, array) => {
        // Find the index of the very first message sent by the user
        const firstUserIndex = array.findIndex(m => m.role === "user");
        
        // Remove the "Welcome" message if it's the first thing in the list
        // Gemini strictly requires the history to start with a 'user' role.
        return index >= firstUserIndex && firstUserIndex !== -1;
      });

    // 4. Start the chat session with the cleaned history
    const chat = model.startChat({
      history: formattedHistory
    });

    // 5. Send the new user message
    const result = await chat.sendMessage(req.body.message);
    const response = await result.response;

    res.json({ text: response.text() });

  } catch (error) {
    console.error("GEMINI API ERROR:", error);
    res.status(500).json({
      error: "Bhante is currently in deep meditation.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Bhante Server is running on http://localhost:${PORT} 🚀`);
  console.log("Model in use: Gemini 2.5 Flash (Free Tier)");
});