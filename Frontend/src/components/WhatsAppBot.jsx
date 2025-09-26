import React, { useState } from 'react'
import './Whatsapp.css'
import { NavLink } from 'react-router-dom';
import ChatHeader from "./ChatHeader";
import bgdash from '../assets/bg-dash.png'
import girl from "../assets/girl.png"
import { useUser } from "../context/UserContext"; 
import mobile from "../assets/Group 51.png"
const Dashboard = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
   const { user,isDesktop  } = useUser(); 
  
 

  return (

    <>
      {isDesktop && <ChatHeader  title={title} />}
    <div className='WhatsappBot'>

      <div className="Whatsapp-container">
        <img className='bgdash' src={bgdash} alt="" />
        <img className='dashchar' src={girl} alt="" />
        <p>Add our Askly in your WhatsApp <br />
to get fully support any time anywhere </p>
      </div>

<div className="whatsapptext">
  <div className="join-group">
    <h4>Steps to acess Askly in WhatsApp</h4>
    <p>‧ Add +91 9516010257 in your WhatsApp</p>
    <p>‧ Join Official Doubt group and use bot</p>
    <button>JOIN GROUP</button>

    <h4 className='s2'>Features of WhatsApp Askly</h4>
    <p>‧ Get 24/7 support on WhatsApp</p>
    <p>‧ Not need to download additional App</p>
  </div>
  <div className="mobile-pic">
    <img src={mobile} alt="" />
  </div>
  </div>     




    </div>
    </>
  )
}

export default Dashboard
