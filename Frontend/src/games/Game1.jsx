import React, { useState, useRef, useEffect } from "react";
import "./Game1.css";
import ChatHeader from "../components/ChatHeader";
import { useUser } from "../context/UserContext"; 

const LEVELS = [
  {
    id: 1,
    title: "Center the frog",
    description: "Use justify-content: center to move the frog to the center lily pad.",
    frogs: 1,
    pads: [50],
    starterCss: `/* center the frog horizontally */\n/* Example:\n   justify-content: center;\n*/`,
    hint: "Apply justify-content: center on #frogs.",
  },
  {
    id: 2,
    title: "Move frog to the right",
    description: "Use justify-content: flex-end to move the frog to the right lily pad.",
    frogs: 1,
    pads: [80],
    starterCss: `/* move the frog to the right */`,
    hint: "Use justify-content: flex-end.",
  },
  {
    id: 3,
    title: "Two frogs: space-between",
    description: "Distribute two frogs with space-between so they sit on the two outer pads.",
    frogs: 2,
    pads: [12, 88],
    starterCss: `/* distribute frogs with space-between */`,
    hint: "Use justify-content: space-between.",
  },
  {
    id: 4,
    title: "Column direction",
    description: "Stack frogs in a column (one above the other) using flex-direction.",
    frogs: 2,
    pads: [50, 50], // vertical targets (we check vertical alignment)
    vertical: true,
    starterCss: `/* stack frogs vertically */`,
    hint: "Use flex-direction: column; and align-items to position.",
  },
  {
    id: 5,
    title: "Align items center",
    description: "Use align-items: center to vertically center frogs.",
    frogs: 1,
    pads: [50],
    starterCss: `/* center vertically */`,
    hint: "Use align-items: center.",
  },
  {
    id: 6,
    title: "Use order",
    description: "Change the order of frogs so green frog reaches the right-most pad.",
    frogs: 3,
    pads: [12, 50, 88],
    starterCss: `/* reorder frogs with order: */`,
    hint: "Assign order on individual .frog elements (e.g., .frog:nth-child(1){order:2}).",
    allowItemCss: true,
  },
  {
    id: 7,
    title: "Align-self",
    description: "Move one frog higher than others using align-self.",
    frogs: 3,
    pads: [12, 50, 88],
    starterCss: `/* use align-self on a frog to change its vertical position */`,
    hint: "Target a specific frog with .frog:nth-child(n) and use align-self.",
    allowItemCss: true,
  },
  {
    id: 8,
    title: "Gap & Wrap",
    description: "Demonstrate gap or wrap behavior to space frogs.",
    frogs: 4,
    pads: [8, 36, 64, 92],
    starterCss: `/* try gap: 20px or flex-wrap */`,
    hint: "Use gap or flex-wrap to affect spacing.",
  },
];

export default function Game1({title}) {
  const { user,isDesktop  } = useUser(); 
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];
  const [code, setCode] = useState(level.starterCss);
  const [itemCode, setItemCode] = useState("");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const frogsRef = useRef(null);
  const boardRef = useRef(null);
  const padsRef = useRef([]);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    setCode(level.starterCss);
    setItemCode("");
    setMessage("");
    setShowHint(false);
    // create padsRef for current level
    padsRef.current = [];
  }, [levelIndex]);

  // apply user's CSS into a <style> tag scoped to this board
  const applyUserCSS = () => {
    // create style content
    const boardId = "game-board";
    const userCss = code || "";
    // allow per-item CSS if level permits
    const itemCss = level.allowItemCss ? itemCode : "";
    const styleContent = `
      #${boardId} #frogs { display: flex; height: 100%; ${userCss} }
      #${boardId} #frogs .frog { transition: transform 260ms ease, top 260ms ease; ${itemCss} }
    `;
    // remove existing style tag if any
    const existing = document.getElementById("game1-user-style");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "game1-user-style";
    s.innerHTML = styleContent;
    document.head.appendChild(s);
  };

  const runAndCheck = async () => {
    setMessage("Running...");
    applyUserCSS();
    // allow layout to update
    await new Promise((r) => setTimeout(r, 350));
    const success = checkSuccess();
    if (success) {
      setMessage("Level Complete! 🎉");
      setCompleted((c) => ({ ...c, [level.id]: true }));
      // auto unlock next after short delay
      setTimeout(() => {
        if (levelIndex < LEVELS.length - 1) setLevelIndex((i) => i + 1);
      }, 900);
    } else {
      setMessage("Not correct yet. Try again or view a hint.");
    }
  };

  const resetCode = () => {
    setCode(level.starterCss);
    setItemCode("");
    setMessage("");
    const existing = document.getElementById("game1-user-style");
    if (existing) existing.remove();
  };

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  const checkSuccess = () => {
    const board = boardRef.current;
    const frogs = frogsRef.current ? Array.from(frogsRef.current.children) : [];
    if (!board || frogs.length === 0) return false;

    // compute pad centers (pads are absolute markers inside board)
    const padCenters = padsRef.current.map((p) => {
      if (!p) return null;
      return center(p);
    });

    // compute frog centers
    const frogCenters = frogs.map((f) => center(f));

    // For vertical checks (level.vertical) we compare y axis; otherwise x axis
    const axis = level.vertical ? "y" : "x";

    const threshold = 28; // pixels tolerance
    // Determine mapping: frog i should match pad i (basic target)
    for (let i = 0; i < Math.min(frogCenters.length, padCenters.length); i++) {
      const fc = frogCenters[i];
      const pc = padCenters[i];
      if (!fc || !pc) return false;
      const dist = Math.abs(fc[axis] - pc[axis]);
      if (dist > threshold) return false;
    }
    return true;
  };

  const downloadCertificate = () => {
    const text = `FlexFrog - Certificates\nPlayer: Guest\nCompleted Levels:\n${Object.keys(completed)
      .map((k) => "Level " + k)
      .join("\n")}\n\nGreat job!`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flexfrog-certificate.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // helper to render frog items
  const renderFrogs = () => {
    const arr = [];
    for (let i = 0; i < level.frogs; i++) {
      arr.push(
        <div className="frog" key={i} title={`Frog ${i + 1}`}>
          <span role="img" aria-label="frog" className="frog-emoji">
            🐸
          </span>
        </div>
      );
    }
    return arr;
  };

  return (
      <>
    {isDesktop && <ChatHeader  title={title} />}
    <div className="game1-admain">

    
    <div className="game1-root">
      <style>{/* small scoped styles for board and UI if Game1.css missing */}</style>

      <div className="game1-shell">
        <header className="game1-header">
          <h1>FlexFrog — Learn Flexbox</h1>
          <div className="game1-progress">
            Level {levelIndex + 1} / {LEVELS.length}
          </div>
        </header>

        <main className="game1-main">
          <section className="game1-left">
            <div className="problem-card">
              <h2>{level.title}</h2>
              <p className="problem-desc">{level.description}</p>
              <div className="problem-actions">
                <button className="btn" onClick={() => runAndCheck()}>
                  Run Code
                </button>
                <button className="btn alt" onClick={resetCode}>
                  Reset
                </button>
                <button
                  className="btn hint"
                  onClick={() => {
                    setShowHint((s) => !s);
                    setMessage("");
                  }}
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
              </div>

              {showHint && <div className="hint-box">{level.hint}</div>}
              <div className="status">{message}</div>
            </div>

            <div className="editor-card">
              <h3>Editor — Container CSS (#frogs)</h3>
              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
              {level.allowItemCss && (
                <>
                  <h4>Optional: Item CSS (.frog)</h4>
                  <textarea
                    className="code-editor small"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    placeholder="e.g. .frog:nth-child(2){order: -1}"
                  />
                </>
              )}
            </div>

            <div className="controls-bottom">
              <button
                className="btn next"
                onClick={() => setLevelIndex((i) => Math.max(0, i - 1))}
                disabled={levelIndex === 0}
              >
                Prev
              </button>
              <button
                className="btn next"
                onClick={() => setLevelIndex((i) => Math.min(LEVELS.length - 1, i + 1))}
                disabled={levelIndex === LEVELS.length - 1}
              >
                Next
              </button>
              <button className="btn download" onClick={downloadCertificate}>
                Download Certificate
              </button>
            </div>
          </section>

          <section className="game1-right">
            <div className="board-wrap">
              <div className="board-info">Goal: place frogs on the lily pads</div>
              <div id="game-board" className="game-board" ref={boardRef}>
                {/* lilies positioned by percent from level.pads */}
                {level.pads.map((p, idx) => (
                  <div
                    key={idx}
                    className="lily"
                    ref={(el) => (padsRef.current[idx] = el)}
                    style={{
                      left: `${p}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <span role="img" aria-label="lily">
                      🪷
                    </span>
                  </div>
                ))}

                <div id="frogs" className="frogs" ref={frogsRef}>
                  {renderFrogs()}
                </div>
              </div>

              <div className="legend">
                <div className="pad-legend">
                  Lily pad positions shown as targets.
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
    </div>
    </>
  );
}