"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ShareMeal() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🙏 Welcome, seeker. How may Bhante guide you toward peace today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Auto Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    const userMessage = { role: "user", content: currentInput };
    
    // 🔥 1. Keep a reference to the OLD history before adding the new user message
    const historyForBackend = [...messages]; 

    // 2. Update the UI to show the user's message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: currentInput,         // The new question
          history: historyForBackend     // The previous conversation
        })
      });

      if (!response.ok) throw new Error("Bhante is silent right now.");

      const data = await response.json();
      const fullText = data.text;

      // 3. Setup the "Typing" effect
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      let index = 0;
      const interval = setInterval(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = fullText.slice(0, index + 1);
          }
          return newMessages;
        });

        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 10); // Speed up typing slightly for better UX

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I am sorry, my connection to the world is weak. Please try again." }]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5DC]"> {/* Soft cream background */}

      {/* Header - Saffron/Monastic Color */}
      <div className="bg-[#B22222] text-white text-center p-4 text-xl font-semibold shadow-lg">
        Bhante AI 🌿
        <p className="text-xs font-light opacity-80">Path to Mindfulness</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-2xl px-5 py-4 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#D2691E] text-white rounded-br-none" // Burnt Orange for user
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm italic">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            Bhante is reflecting...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 flex gap-3 shadow-2xl">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B22222]"
          placeholder="Ask for guidance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-[#B22222] hover:bg-[#8B0000]"
          } text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium`}
        >
          {loading ? "..." : "Seek"}
        </button>
      </div>
    </div>
  );
}