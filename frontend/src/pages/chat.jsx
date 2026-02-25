"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ShareMeal() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🙏 Welcome. How may Bhante guide you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // 🔥 Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input,
          history: updatedMessages
        })
      });

      const data = await response.json();
      const fullText = data.text;

      // Add empty assistant message first
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      let index = 0;

      const interval = setInterval(() => {
        index++;

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];

          if (lastMessage.role === "assistant") {
            lastMessage.content = fullText.slice(0, index);
          }

          return newMessages;
        });

        if (index >= fullText.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 15); // typing speed

    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-green-700 text-white text-center p-4 text-xl font-semibold shadow-md">
        Bhante AI 🌿
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
              className={`max-w-2xl px-5 py-4 rounded-2xl shadow-md whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 text-sm animate-pulse">
            Bhante is Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-3">
        <input
          type="text"
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Share your thoughts..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}