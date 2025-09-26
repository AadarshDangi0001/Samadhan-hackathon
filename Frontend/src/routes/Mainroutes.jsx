// src/routes/Mainroutes.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";

import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Dashboard from "../components/Dashboard.jsx";
import ChatAI from "../components/ChatAI.jsx";
import BulletBoard from "../components/BulletBoard.jsx";
import OfflineMode from "../components/OfflineMode.jsx";
import ScanDocs from "../components/ScanDocs.jsx";
import WhatsAppBot from "../components/WhatsAppBot.jsx";
import VolunteersHelp from "../components/VolunteersHelp.jsx";
import AboutUs from "../components/AboutUs.jsx";
import AIAgent from "../components/AIAgent.jsx";
import Settings from "../components/Settings.jsx";
import AsklyAI from "../pages/AsklyAI.jsx";
import Games from "../pages/Games.jsx";

const Mainroutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard title="Dashboard" />} />

      {/* Protected Routes */}
      <Route path="/chat-ai" element={<PrivateRoute><ChatAI title="Chat AI" /></PrivateRoute>} />
      <Route path="/bulletin" element={<PrivateRoute><BulletBoard title="Bullet Board" /></PrivateRoute>} />
      <Route path="/offline" element={<PrivateRoute><OfflineMode title="Offline Mode" /></PrivateRoute>} />
      <Route path="/scan-docs" element={<PrivateRoute><ScanDocs title="Scan Docs" /></PrivateRoute>} />
      <Route path="/whatsapp-bot" element={<PrivateRoute><WhatsAppBot title="WhatsApp Bot" /></PrivateRoute>} />
      <Route path="/volunteers-help" element={<PrivateRoute><VolunteersHelp title="Volunteers Help" /></PrivateRoute>} />
      <Route path="/about" element={<PrivateRoute><AboutUs title="About Us" /></PrivateRoute>} />
      <Route path="/ai-agent" element={<PrivateRoute><AIAgent title="AI Agent" /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings title="Settings" /></PrivateRoute>} />
      <Route path="/askly-ai" element={<PrivateRoute><AsklyAI title="Askly-AI"/></PrivateRoute>} />
      <Route path="/games" element={<PrivateRoute><Games title="Games"/></PrivateRoute>} />
    </Routes>
  );
};

export default Mainroutes;
