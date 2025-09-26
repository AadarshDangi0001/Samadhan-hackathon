import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AsklyAi.css";
// import { useUser } from "../context/UserContext"; // keep if needed

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AsklyAI() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      text: "Hello! Ask me to generate code or explain concepts.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [code, setCode] = useState("");
  const [resources, setResources] = useState("");
  const [likedMessages, setLikedMessages] = useState([]);
  const [showLiked, setShowLiked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chat/chatwithai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      let { explanation: rawExplanation, code: rawCode, resources: rawResources } = data;

      rawExplanation = rawExplanation || "";
      rawCode = rawCode || "";
      rawResources = rawResources || "";

      // Remove prompt separators if model included them
      const cleanedExplanation = rawExplanation.replace(/---\s*/g, "").trim();

      // Stream explanation chunks to chat (simple simulated streaming)
      const explanationChunks = cleanedExplanation
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      explanationChunks.forEach((chunk, i) => {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { text: chunk, sender: "bot", timestamp: new Date() },
          ]);
          scrollToBottom();
        }, 3000 * i); // smaller interval for snappier feel
      });

      // Update UI panels
      setExplanation(cleanedExplanation);
      setCode(rawCode);
      setResources(rawResources);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble responding. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends message (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const toggleSpeech = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (text && text.trim().length > 0) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1;
      speech.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(speech);
      setIsSpeaking(true);
    }
  };

  const handleLikeMessage = (message) => {
    if (!likedMessages.includes(message.text)) {
      setLikedMessages((prev) => [...prev, message.text]);
    }
  };

  return (
    <div className="ad">
      <div className="adchatmain">
        <header className="adchat-header">
          <div className="adchat-header-left">
            <div className="adspeaker-buttons">
              <button
                onClick={() => toggleSpeech(explanation)}
                disabled={isLoading}
                className="adspeaker-button"
                title="Read Explanation"
              >
                🎤 Read Explanation
              </button>
              <button
                onClick={() => toggleSpeech(code)}
                disabled={isLoading}
                className="adspeaker-button"
                title="Read Code"
              >
                🎤 Read Code
              </button>
            </div>

            <div className="adliked-section">
              <i
                className="ri-heart-fill"
                onClick={() => setShowLiked(!showLiked)}
                title="Liked Messages"
                style={{ cursor: "pointer", fontSize: "20px", marginRight: "10px" }}
              />
              {showLiked && (
                <div className="adliked-dropdown">
                  <h4>❤️ Liked Messages</h4>
                  {likedMessages.length === 0 ? (
                    <p>No liked messages yet.</p>
                  ) : (
                    <ul>
                      {likedMessages.map((msg, idx) => (
                        <li key={idx} style={{ marginBottom: "8px" }}>
                          {msg}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="adcontainer">
          <div className="adchatbot-container">
            <div className="adchat-head">
              <h2>Chat Bot</h2>
            </div>

            <div className="adchat-messages">
              {messages.map((message, index) => {
                const ts = new Date(message.timestamp);
                return (
                  <div
                    key={index}
                    className={`admessage ${
                      message.sender === "user" ? "aduser-message" : "adbot-message"
                    } ${index === messages.length - 1 && isLoading ? "thinking" : ""}`}
                  >
                    <div className="admessage-content">
                      <div>
                        {message.text
                          .split("\n")
                          .filter((line) => line.trim() !== "")
                          .map((line, idx) => {
                            const match = line.match(/\[(.*?)\]\((.*?)\)/);
                            if (match) {
                              const [, title, link] = match;
                              return (
                                <div key={idx} style={{ marginBottom: "8px" }}>
                                  <h4 style={{ margin: "4px 0" }}>{title}</h4>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#007bff" }}
                                  >
                                    {link}
                                  </a>
                                </div>
                              );
                            } else {
                              return (
                                <p key={idx} style={{ marginBottom: "8px", lineHeight: "1.5" }}>
                                  {line}
                                </p>
                              );
                            }
                          })}
                      </div>

                      {(message.sender === "bot" || message.sender === "user") && (
                        <button
                          onClick={() => handleLikeMessage(message)}
                          className="adlike-button"
                          title="Like"
                        >
                          <i
                            className={
                              likedMessages.includes(message.text) ? "ri-heart-fill" : "ri-heart-line"
                            }
                            style={{
                              color: likedMessages.includes(message.text) ? "red" : "#aaa",
                            }}
                          />
                        </button>
                      )}

                      {!isLoading && (
                        <span className="admessage-time">
                          {ts.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
             
              {isLoading && (
                <div className="admessage adbot-message thinking">
                  <div className="admessage-content">
                    <div className="adtyping-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="adchat-input-container">
              <input
                type="text"
                placeholder="Ask a question or talk..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="adchat-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="adsend-button"
              >
                {isLoading ? "..." : <i className="ri-send-plane-2-line" />}
              </button>
              <button
                onClick={handleVoiceInput}
                disabled={isLoading}
                className="advoice-input-button"
                title="Voice input"
              >
                <i className="ri-mic-2-line admic" />
              </button>
            </div>

            <div className="admobile-toggle-buttons">
              <button
                className={`adtoggle-button ${showCode ? "adactive" : ""}`}
                onClick={() => {
                  setShowCode(!showCode);
                  setShowResources(false);
                }}
              >
                <i className="ri-code-line" /> See Code
              </button>
              <button
                className={`adtoggle-button ${showResources ? "adactive" : ""}`}
                onClick={() => {
                  setShowResources(!showResources);
                  setShowCode(false);
                }}
              >
                <i className="ri-book-line" /> See Resources
              </button>
            </div>
          </div>

          <div
            className="adeditor-container"
            style={{
              width: "60%",
              display: isMobile ? (showCode ? "block" : "none") : "block",
            }}
          >
            <h2>Generated Code</h2>
            <pre className="adcode-editor">{code}</pre>
          </div>

          <div
            className="adresources-container"
            style={{
              width: "25%",
              overflow: "hidden",
              display: isMobile ? (showResources ? "block" : "none") : "block",
            }}
          >
            <h2>Related Resources</h2>
            {resources ? (
              <div className="adresources-content">
                {resources
                  .trim()
                  .split("\n")
                  .filter((line) => line.startsWith("-"))
                  .map((item, index) => {
                    const match = item.match(/\[(.*?)\]\((.*?)\)/);
                    if (!match) return null;
                    const [, title, link] = match;
                    return (
                      <div key={index} className="adresource-item" style={{ marginBottom: "10px" }}>
                        <h4 style={{ margin: "5px 0" }}>{title}</h4>
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                          {link}
                        </a>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p>No resources available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
