import React, { useState } from 'react'
import './dashboard.css'
import { NavLink } from 'react-router-dom';
import ChatHeader from "./ChatHeader";
import bgdash from '../assets/bg-dash.png'
import kid from "../assets/kid.png"
import { useUser } from "../context/UserContext"; 

const Dashboard = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isDesktop } = useUser(); 

  return (
    <>
      {/* ✅ Show ChatHeader only on desktop */}
      {isDesktop && <ChatHeader title={title} />}

      <div className='dashboard'>
        <div className="container">
          <img className='bgdash' src={bgdash} alt="" />
          <img className='dashchar' src={kid} alt="" />
          <p className='bridge'>
            Bridging the Education Gap <br />
            with Smart, Accessible, <br />
            and Connected <br />
            Learning Solutions
          </p>
        </div>

        <div className="features">
          <h3>Features</h3>
          <div className="box-container">
            {isDesktop ? (
              // Desktop view → Show only 4
              <>
               <NavLink to="/askly-ai" className="box1">
                  <h4>Askly AI</h4>
                  <h1>01</h1>
                  <p>Not just copy code ,learn it</p>
                </NavLink>
                <NavLink to="/chat-ai" className="box1">
                  <h4>Chat AI</h4>
                  <h1>02</h1>
                  <p>24/7 available</p>
                </NavLink>

                <NavLink to="/whatsapp-bot" className="box1">
                  <h4>WhatsApp Bot</h4>
                  <h1>03</h1>
                  <p>Connect with humans</p>
                </NavLink>
                <NavLink to='/scan-docs' className="box1">
                  <h4>Scan Docs</h4>
                  <h1>04</h1>
                  <p>Get summary</p>
                </NavLink>
              </>
            ) : (
              // Mobile view → Show all 6
              <>
                <NavLink to="/chat-ai" className="box1">
                  <h4>Chat AI</h4>
                  <h1>01</h1>
                  <p>24/7 available</p>
                </NavLink>
                <NavLink to="/bulletin" className="box1">
                  <h4>Bullet Board</h4>
                  <h1>02</h1>
                  <p>New Updates</p>
                </NavLink>
                <NavLink to="/volunteers-help" className="box1">
                  <h4>Volunteers Help</h4>
                  <h1>03</h1>
                  <p>Connect with humans</p>
                </NavLink>
                <NavLink to='/scan-docs' className="box1">
                  <h4>Scan Docs</h4>
                  <h1>04</h1>
                  <p>Get summary</p>
                </NavLink>
                <NavLink to='/whatsapp-bot' className="box1">
                  <h4>WhatsApp Bot</h4>
                  <h1>05</h1>
                  <p>Gets on your WhatsApp</p>
                </NavLink>
                <NavLink to='/about' className="box1">
                  <h4>About App</h4>
                  <h1>06</h1>
                  <p>Get All info about App</p>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
