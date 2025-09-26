// BulletBoard.jsx
import React, { useState } from 'react';
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext"; 
import './bullet.css';
import run from "../assets/image 15.png";
import rectangle from "../assets/Rectangle 5.png";
import cardData from "../data/CardData.jsx"; // 👈 importing your array
const BulletBoard = ({ title }) => {
  const { user, isDesktop } = useUser();
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleReadMore = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className='bullets'>
           {isDesktop && <ChatHeader title={title} />}
      <div className="bullet-container">
        <div className="pic-bg">
          <img className='rec' src={rectangle} alt="" />
          <div className="run">
            <img className='run-kid' src={run} alt="" />
          </div>
          <div className="texting">
            <p>
              Never miss critical updates 
              like fees, exams, circulars, 
              and schedules with our 
              smart bulletin system.
            </p>
          </div>

          {/* Cards section */}
          <div className="cards">
            {cardData.map((card, index) => {
              const maxLength = 100; // 👈 set your limit
              const isExpanded = expandedCard === index;
              const displayText = isExpanded
                ? card.text
                : card.text.slice(0, maxLength);

              return (
                <div key={index} className="cards1">
                  <h3 className="card-heading">{card.heading}</h3>
                  <p className="card-text">{displayText}</p>
                  {card.text.length > maxLength && (
                    <button
                      className="read-more-btn"
                      onClick={() => toggleReadMore(index)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletBoard;
