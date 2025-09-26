import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import "./ChatAI.css";
import ChatHeader from "./ChatHeader";

const OfflineMode = ({ title }) => {
  const { user, isDesktop } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ Load offline history/messages from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("offlineMessages")) || [];
    const savedHistory = JSON.parse(localStorage.getItem("offlineHistory")) || [];
    setMessages(savedMessages);
    setHistory(savedHistory);
  }, []);

  // ✅ Save messages & history to localStorage
  useEffect(() => {
    localStorage.setItem("offlineMessages", JSON.stringify(messages));
    localStorage.setItem("offlineHistory", JSON.stringify(history));
  }, [messages, history]);

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message (offline only)
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    const aiMessage = {
      type: "ai",
      text: "⚡ (Offline Mode) No AI response available.",
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setHistory((prev) => [input, ...prev]);
    setInput("");
  };

  // ✅ Toggle sidebar (mobile only)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ✅ Start a new chat (offline reset)
  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setHistory([]);
    localStorage.removeItem("offlineMessages");
    localStorage.removeItem("offlineHistory");
  };

  return (
    <div className="chatai">
      {isDesktop && <ChatHeader title={title || "Offline Mode"} />}

      <div className="contain">
        {messages.length === 0 && (
          <div className="contain-text">
            <h2>Welcome to Offline Mode</h2>
            <p>Chat is stored locally. No internet required 🚀</p>
          </div>
        )}

        {/* Chat Window */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.type === "user" ? "user" : "ai"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Form */}
        <div className="form-chat">
          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder='Type your message (offline)'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="send" onClick={handleSend}>
              <i className="ri-send-plane-2-fill"></i>
            </div>
          </form>
        </div>

        {/* Right Sidebar */}
        <div
          className={`right-sidebar ${
            isDesktop ? "open" : sidebarOpen ? "open" : "closed"
          }`}
        >
          {!isDesktop && (
            <div className="toggle-btn" onClick={toggleSidebar}>
              {sidebarOpen ? (
                <i className="ri-arrow-right-s-line"></i>
              ) : (
                <i className="ri-arrow-left-s-fill"></i>
              )}
            </div>
          )}

          {(isDesktop || sidebarOpen) && (
            <div className="sidebar-content">
              <p className="start" onClick={handleNewChat}>
                + Start a new offline chat
              </p>

              <div className="history-list">
                {history.length === 0 && <p>No history yet</p>}
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="history-item"
                    onClick={() => setInput(item)} // reuse input
                  >
                    <i className="ri-chat-4-line"></i>
                    {item.length > 10 ? item.substring(0, 10) + "..." : item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;
