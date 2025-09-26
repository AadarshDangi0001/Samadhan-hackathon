import React from 'react';
import './Games.css';
import ChatHeader from "../components/ChatHeader";
import { useUser } from "../context/UserContext"; 

const Games = ({title}) => {
       const { user,isDesktop  } = useUser(); 
  const games = Array.from({ length: 8 }, (_, i) => `Game ${i + 1}`);

  const handlePlay = (game) => {
    // placeholder - you can wire this to actual game routes
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
        {/* <div>
          <button className="ad-play-button" onClick={() => alert('Play all games (demo)')}>Play All</button>
        </div> */}
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
              <button className="ad-play-button" onClick={() => handlePlay(g)}>Play {idx + 1}</button>
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
     </div>
 </>
    
  );
};

export default Games;
