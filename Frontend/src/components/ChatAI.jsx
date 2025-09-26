import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext"; 
import axios from "axios";
import io from "socket.io-client";
import "./ChatAI.css";
import ChatHeader from "./ChatHeader";

// Configure axios to include credentials by default
axios.defaults.withCredentials = true;

const BACKEND_URL = "http://localhost:3000"; // This should match your backend port

const ChatAI = ({ title }) => {
  const { user, isDesktop } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]); 
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  // Connect to socket.io server
  useEffect(() => {
    try {
      socketRef.current = io(BACKEND_URL, {
        withCredentials: true
      });

      // Connection events
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsLoading(false);
      });

      // Listen for AI responses
      socketRef.current.on("ai-response", (data) => {
        console.log("Received AI response:", data);
        if (data.chat === currentChatId) {
          setMessages(prev => [...prev, { role: "model", content: data.message }]);
          setIsLoading(false);
        }
      });

      socketRef.current.on("ai-error", (data) => {
        console.error("AI error:", data);
        if (data.chat === currentChatId) {
          setMessages(prev => [...prev, { role: "model", content: "Sorry, there was an error processing your request." }]);
          setIsLoading(false);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    } catch (error) {
      console.error("Error setting up socket connection:", error);
    }
  }, [currentChatId]);

  // Fetch user's chats on mount
  useEffect(() => {
    if (user && user._id) {
      console.log("User authenticated, fetching chats...");
      fetchChats();
    } else {
      console.log("User not authenticated or loaded yet");
    }
  }, [user]);

  // Fetch messages when currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
      const currentChat = chats.find(chat => chat._id === currentChatId);
      setChatTitle(currentChat?.title || "New Chat");
      // Always exit edit mode when changing chats
      setIsEditing(false);
    }
  }, [currentChatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat`, {
        withCredentials: true
      });
      setChats(res.data.chats || []);
      
      // Set first chat as current if exists and no current chat is selected
      if (res.data.chats.length > 0 && !currentChatId) {
        setCurrentChatId(res.data.chats[0]._id);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/messages/${chatId}`, {
        withCredentials: true
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // If no chat exists, create one first
    let chatId = currentChatId;
    if (!chatId) {
      try {
        console.log("Creating new chat...");
        const res = await axios.post(`${BACKEND_URL}/api/chat`, { 
          title: "New Chat" 
        }, {
          withCredentials: true
        });
        console.log("Chat created:", res.data);
        chatId = res.data.chat._id;
        setCurrentChatId(chatId);
        setChats(prev => [res.data.chat, ...prev]);
      } catch (err) {
        console.error("Error creating chat:", err);
        alert("Error creating chat. Please make sure you're logged in.");
        return;
      }
    }

    // Add user message to UI
    setMessages(prev => [...prev, { role: "user", content: input }]);
    
    // Show loading state
    setIsLoading(true);

    try {
      // Check if socket is connected
      if (!socketRef.current || !socketRef.current.connected) {
        console.error("Socket not connected. Attempting to reconnect...");
        socketRef.current = io(BACKEND_URL, { withCredentials: true });
      }
      
      // Send message through socket.io
      console.log("Sending message:", { content: input, chat: chatId });
      socketRef.current.emit("ai-message", JSON.stringify({
        content: input,
        chat: chatId
      }));
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { role: "model", content: "Error: Could not send message. Please try again." }]);
      setIsLoading(false);
    }

    // Clear input
    setInput("");
  };

  // Create a new chat
  const handleNewChat = async () => {
    try {
      console.log("Creating new chat...");
      const res = await axios.post(`${BACKEND_URL}/api/chat`, {
        title: "New Chat"
      }, {
        withCredentials: true
      });
      
      console.log("New chat created:", res.data);
      const newChat = res.data.chat;
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat._id);
      setMessages([]);
      setChatTitle("New Chat");
    } catch (err) {
      console.error("Error creating new chat:", err);
      alert("Error creating new chat. Please check your connection and make sure you're logged in.");
    }
  };

  // Toggle sidebar (mobile only)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Switch to a different chat
  const switchChat = (chatId) => {
    if (currentChatId !== chatId) {
      setCurrentChatId(chatId);
      // Update chat title when switching
      const selectedChat = chats.find(chat => chat._id === chatId);
      if (selectedChat) {
        setChatTitle(selectedChat.title);
      }
      // Exit editing mode if active
      if (isEditing) {
        setIsEditing(false);
      }
    }
    if (!isDesktop) {
      setSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  // Delete a chat
  const deleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/${chatId}`, {
        withCredentials: true
      });
      
      // Update chat list
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      
      // If deleted chat is current chat, set first available chat as current or null
      if (chatId === currentChatId) {
        const nextChat = chats.find(chat => chat._id !== chatId);
        setCurrentChatId(nextChat ? nextChat._id : null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  // Update chat title
  const updateChatTitle = async () => {
    if (!currentChatId || !chatTitle.trim()) return;
    
    try {
      await axios.put(`${BACKEND_URL}/api/chat/${currentChatId}`, {
        title: chatTitle
      }, {
        withCredentials: true
      });
      
      // Update local chat title
      setChats(prev => 
        prev.map(chat => 
          chat._id === currentChatId ? { ...chat, title: chatTitle } : chat
        )
      );
      
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating chat title:", err);
    }
  };

  // If no user is logged in, show a simple message
  if (!user || !user._id) {
    return (
      <div className="chatai">
        <div className="contain">
          <div className="contain-text">
            <h2>Please log in to use the AI chat</h2>
            <p>You need to be logged in to access the chat features</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatai">
      
                 {isDesktop && <ChatHeader title={title} />}

    

      <div className="contain">
        {!currentChatId && messages.length === 0 && (
          <div className="contain-text">
            <h2>Welcome to Your AI</h2>
            <p>The power of AI at your service - Name the knowledge</p>
          </div>
        )}

        {/* Chat Window */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message ai loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Form */}
        <div className="form-chat">
          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder='Example: "Explain Quantum Computing"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <div 
              className={`send ${isLoading ? 'disabled' : ''}`} 
              onClick={isLoading ? null : handleSend}
            >
              <i className="ri-send-plane-2-fill"></i>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Chat List */}
        <div
          className={`right-sidebar ${
            isDesktop ? "open" : sidebarOpen ? "open" : "closed"
          }`}
        >
          {/* Toggle button only for mobile */}
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
                + Start a new chat
              </p>

              <div className="chat-list">
                {chats.length === 0 && <p>No chats yet</p>}
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`chat-item ${currentChatId === chat._id ? 'active' : ''}`}
                    onClick={() => switchChat(chat._id)}
                  >
                    <i className="ri-chat-4-line"></i>
                    {isEditing && currentChatId === chat._id ? (
                      <input 
                        className="edit-chat-title"
                        type="text"
                        value={chatTitle}
                        onChange={(e) => setChatTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') updateChatTitle();
                          else if (e.key === 'Escape') setIsEditing(false);
                        }}
                        onBlur={() => updateChatTitle()}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="chat-title"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (chat._id === currentChatId) {
                            setChatTitle(chat.title);
                            setIsEditing(true);
                          }
                        }}
                      >
                        {chat.title}
                      </span>
                    )}
                    <i 
                      className="ri-delete-bin-line delete-icon" 
                      onClick={(e) => deleteChat(chat._id, e)}
                    ></i>
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

export default ChatAI;
