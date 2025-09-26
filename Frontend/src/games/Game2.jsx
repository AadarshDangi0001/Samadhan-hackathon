import React, { useEffect, useRef, useState } from "react";
import "./Game2.css";

import ChatHeader from "../components/ChatHeader";
import { useUser } from "../context/UserContext"; 

// Single simple level: user must center arrow using position + transform on .arrow
const LEVELS = [
  {
    id: 1,
    title: "Center with position + transform",
    description: "Use absolute positioning and transform to place the arrow at the center.",
    allowItemCss: true,
    hint: "Add to Item CSS: position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);",
  },
];

export default function Game2({ title }) {
  const { user, isDesktop } = useUser();
  const level = LEVELS[0];

  const [containerCss, setContainerCss] = useState("/* container CSS not required */");
  const [itemCss, setItemCss] = useState("");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [startEdge, setStartEdge] = useState("top");
  const [celebrate, setCelebrate] = useState(false);

  const boardRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    setContainerCss("/* container CSS not required */");
    setItemCss("");
    setMessage("");
    setShowHint(false);
    pickRandomEdge();
    removeUserStyle();
    setCelebrate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickRandomEdge = () => {
    const edges = ["top", "bottom", "left", "right"];
    const e = edges[Math.floor(Math.random() * edges.length)];
    setStartEdge(e);
  };

  const userStyleId = "game2-user-style";

  const applyUserCSS = () => {
    const container = containerCss || "";
    const item = itemCss || "";

    let styleContent = "";
    // Keep container rules if provided (not required)
    if (container && (container.includes("{") || container.includes("#") || container.includes("."))) {
      styleContent += container + "\n";
    } else if (container && container.trim() !== "" && container.trim() !== "/* container CSS not required */") {
      styleContent += `#game2-board .inner { ${container} }\n`;
    }

    // Item CSS must be applied to .arrow (wrap if plain properties)
    if (item) {
      if (item.includes("{") || item.includes("#") || item.includes(".")) {
        styleContent += item + "\n";
      } else {
        styleContent += `#game2-board .arrow { ${item} }\n`;
      }
    }

    const existing = document.getElementById(userStyleId);
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = userStyleId;
    s.innerHTML = styleContent;
    document.head.appendChild(s);
  };

  const removeUserStyle = () => {
    const existing = document.getElementById(userStyleId);
    if (existing) existing.remove();
  };

  const placeArrowAtEdge = () => {
    // Reset user style so base placement applies
    removeUserStyle();
    const arrow = arrowRef.current;
    const inner = boardRef.current.querySelector(".inner");
    if (!arrow || !inner) return;

    arrow.style.position = "absolute";
    arrow.style.transform = "translate(0,0)";
    arrow.style.left = "auto";
    arrow.style.top = "auto";
    arrow.style.right = "auto";
    arrow.style.bottom = "auto";

    switch (startEdge) {
      case "top":
        arrow.style.top = "8px";
        arrow.style.left = "50%";
        arrow.style.transform = "translateX(-50%)";
        break;
      case "bottom":
        arrow.style.bottom = "8px";
        arrow.style.left = "50%";
        arrow.style.transform = "translateX(-50%)";
        break;
      case "left":
        arrow.style.left = "8px";
        arrow.style.top = "50%";
        arrow.style.transform = "translateY(-50%)";
        break;
      case "right":
        arrow.style.right = "8px";
        arrow.style.top = "50%";
        arrow.style.transform = "translateY(-50%)";
        break;
      default:
        arrow.style.top = "8px";
        arrow.style.left = "50%";
        arrow.style.transform = "translateX(-50%)";
    }
  };

  useEffect(() => {
    placeArrowAtEdge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEdge]);

  const resetBoard = () => {
    removeUserStyle();
    pickRandomEdge();
    setMessage("");
    setCelebrate(false);
    placeArrowAtEdge();
  };

  const checkCentered = () => {
    const board = boardRef.current;
    const arrow = arrowRef.current;
    if (!board || !arrow) return false;
    const b = board.getBoundingClientRect();
    const a = arrow.getBoundingClientRect();

    const boardCenterX = b.left + b.width / 2;
    const boardCenterY = b.top + b.height / 2;
    const arrowCenterX = a.left + a.width / 2;
    const arrowCenterY = a.top + a.height / 2;

    const dx = Math.abs(boardCenterX - arrowCenterX);
    const dy = Math.abs(boardCenterY - arrowCenterY);
    const threshold = Math.max(12, Math.min(b.width, b.height) * 0.06);

    return dx <= threshold && dy <= threshold;
  };

  const runAndCheck = async () => {
    setMessage("Applying...");
    applyUserCSS();
    await new Promise((r) => setTimeout(r, 300));
    const ok = checkCentered();
    if (ok) {
      setMessage("Level Complete! 🎉");
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        // after success, reset for replay
        resetBoard();
      }, 1200);
    } else {
      setMessage("Not centered yet. Try again or view the hint.");
    }
  };

  return (
    <>
      {isDesktop && <ChatHeader title={title} />}
      <div className="game2-admain">
        <div className="game2-root">
          <header className="game2-header">
            <h1>Center the Arrow</h1>
            <div className="game2-progress">Level 1 / 1</div>
          </header>

          <main className="game2-main">
            <section className="game2-left">
              <div className="game2-card">
                <h2>{level.title}</h2>
                <p className="desc">{level.description}</p>
                <div className="game2-actions">
                  <button className="btn" onClick={runAndCheck}>
                    Run Code
                  </button>
                  <button className="btn alt" onClick={resetBoard}>
                    Reset
                  </button>
                  <button className="btn hint" onClick={() => setShowHint((s) => !s)}>
                    {showHint ? "Hide Hint" : "Hint"}
                  </button>
                </div>

                {showHint && <div className="hint">{level.hint}</div>}

                <div className="editor">
                  <label>Item CSS (apply to .arrow)</label>
                  <textarea
                    value={itemCss}
                    onChange={(e) => setItemCss(e.target.value)}
                    className="code"
                    placeholder="e.g. position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                  />
                  <div style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>
                    Tip: paste the exact properties from the hint into Item CSS.
                  </div>
                </div>

                <div className="message">{message}</div>
              </div>
            </section>

            <section className="game2-right">
              <div className="board-wrap">
                <div id="game2-board" ref={boardRef} className={`board ${celebrate ? "celebrate" : ""}`}>
                  <div className="inner">
                    <div id="arrow" ref={arrowRef} className={`arrow start-${startEdge}`}>
                      ⬆️
                    </div>
                  </div>
                </div>
                <div className="board-help">Center the arrow using the CSS shown in the hint.</div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}







