const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// 1. ENSURE THIS IS DEFINED GLOBALLY IN THIS FILE
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);





app.post("/api/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
ROLE: You are "Bhante," a wise and compassionate Buddhist monk...

`
    });

    // 1️⃣ Filter and format history correctly for Gemini
    const formattedHistory = (req.body.history || [])
      .filter(msg => msg.role === "user") // remove assistant messages
      .map(msg => ({
        role: "user",
        parts: [{ text: msg.content }]
      }));

    // 2️⃣ Start chat with safe history
    const chat = model.startChat({
      history: formattedHistory
    });

    // 3️⃣ Send new message
    const result = await chat.sendMessage(req.body.message);
    const response = await result.response;

    res.json({ text: response.text() });

  } catch (error) {
    console.error("GEMINI API ERROR:", error);
    res.status(500).json({
      error: "Bhante is unavailable right now",
      details: error.message
    });
  }
});

// ... (rest of your MongoDB and app.use code)

app.listen(PORT, () => {
  console.log(`Bhante Server is running on http://localhost:${PORT} 🚀`);
});