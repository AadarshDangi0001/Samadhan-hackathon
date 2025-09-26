import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Games.css';
import ChatHeader from "../components/ChatHeader";
import { useUser } from "../context/UserContext"; 

const DUMMY_LEADERBOARD = [
  { rank: 1, name: "Asha", points: 1280 },
  { rank: 2, name: "Rohit", points: 1210 },
  { rank: 3, name: "Meera", points: 1185 },
  { rank: 4, name: "Sahil", points: 1100 },
  { rank: 5, name: "Priya", points: 1040 },
  { rank: 6, name: "Vikas", points: 980 },
  { rank: 7, name: "Anita", points: 940 },
  { rank: 8, name: "Karan", points: 900 },
  { rank: 9, name: "Neha", points: 860 },
  { rank: 10, name: "Ishaan", points: 820 },
];

const Games = ({title}) => {
       const { user,isDesktop  } = useUser(); 
  const games = Array.from({ length: 8 }, (_, i) => `Game ${i + 1}`);

  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handlePlay = (game, idx) => {
    // if Game 1 clicked, navigate to /game1 (route already exists)
    if (idx === 0) {
      navigate('/game1');
      return;
    }
    // if Game 2 clicked, navigate to /game2
    if (idx === 1) {
      navigate('/game2');
      return;
    }
    // placeholder for other games
    alert(`${game} clicked — launch game here.`);
  };

  const downloadCertificatesAll = () => {
    // Generate a combined certificate summary for all games (could be tailored to completed ones)
    const now = new Date().toLocaleDateString();
    let content = `Certificates of Completion\n\nGenerated: ${now}\n\n`;
    games.forEach((g) => {
      content += `- ${g}: Completed on ${now}\n`;
    });
    content += `\nCongratulations on completing the games!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All-Games-Certificates-${now.replaceAll('/', '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (

    <>
    {isDesktop && <ChatHeader  title={title} />}
    <div className="ad-game">
      

   
    <div className="ad-games-container">
      <div className="ad-games-header">
        <div>
          <h1>Games & Challenges</h1>
          <div className="ad-games-sub">Play quick learning games and earn certificates</div>
        </div>
        <div className="ad-games-header-actions">
          <button className="ad-leaderboard-button" onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
          {/* <button className="ad-play-button" onClick={() => alert('Play all games (demo)')}>Play All</button> */}
        </div>
      </div>

      <div className="ad-games-grid">
        {games.map((g, idx) => (
          <div key={g} className="ad-game-card">
            <div className="ad-game-title">
              <div className="ad-icon">{idx + 1}</div>
              <div>{g}</div>
            </div>

            <div className="ad-meta">
              {/* <div style={{ fontSize: 13, color: '#334155' }}>Easy • 2–5 min</div> */}
              <div style={{ fontSize: 13, color: '#64748b' }}>Score: 100%</div>
            </div>

            <div className="ad-actions">
              <button className="ad-play-button" onClick={() => handlePlay(g, idx)}>Play {idx + 1}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-games-footer">
        <div className="ad-footer-progress-container">
          <div className="ad-footer-progress">
            <div className="ad-footer-progress-fill" style={{ width: '100%' }} />
          </div>
          <div className="ad-footer-progress-label">Overall Progress: 100%</div>
        </div>

        <button className="ad-download-all-button" onClick={downloadCertificatesAll}>
          Download Certificates
        </button>
      </div>
    </div>

    {showLeaderboard && (
      <div className="ad-leaderboard-modal" role="dialog" aria-modal="true">
        <div className="ad-leaderboard-overlay" onClick={() => setShowLeaderboard(false)} />
        <div className="ad-leaderboard-content">
          <div className="ad-leaderboard-header">
            <h3>Leaderboard</h3>
            <button className="ad-close-btn" onClick={() => setShowLeaderboard(false)}>✕</button>
          </div>
          <ul className="ad-leaderboard-list">
            {DUMMY_LEADERBOARD.map((p) => (
              <li key={p.rank} className="ad-leaderboard-item">
                <span className="ad-rank">#{p.rank}</span>
                <span className="ad-name">{p.name}</span>
                <span className="ad-points">{p.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}

     </div>
 </>
    
  );
};

export default Games;
