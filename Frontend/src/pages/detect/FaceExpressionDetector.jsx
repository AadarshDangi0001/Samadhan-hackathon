import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./Faceexpression.css";
import axios from "axios";
import ChatHeader from "../../components/ChatHeader.jsx";
import { useUser } from "../../context/UserContext"; 
export default function FaceExpressionDetector({title}) {
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const detectionInterval = useRef(null);
  const { user, isDesktop } = useUser();

  const [tracking, setTracking] = useState(false);
  const [expressionCounts, setExpressionCounts] = useState({});
  const [totalDetections, setTotalDetections] = useState(0);
  const [results, setResults] = useState(null);
  const [lastExpression, setLastExpression] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);

  const startVideo = () => {
    // Request webcam and attach stream
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraOn(true);
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        setCameraOn(false);
      });
  };

  const stopCamera = () => {
    // Stop all tracks and detach stream from video element
    try {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {
      console.warn('Error stopping camera tracks', e);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    videoStreamRef.current = null;
    setCameraOn(false);
    // If camera is turned off, ensure detection stops and results are finalized
    if (tracking) stopDetection();
  };

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      startVideo();
    };
    loadModels();
    // Cleanup on unmount: stop intervals and camera
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      if (videoStreamRef.current) {
        try {
          videoStreamRef.current.getTracks().forEach((t) => t.stop());
        } catch (e) {}
      }
    };
  }, []);

  // Continuous tracking
  const startDetection = () => {
    if (tracking) return;
    setTracking(true);
    setExpressionCounts({});
    setTotalDetections(0);
    setResults(null);

    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections || detections.length === 0) return;

      // Pick the strongest expression
      let mostProbableExpression = 0;
      let _expression = "";
      for (const expression of Object.keys(detections[0].expressions)) {
        if (detections[0].expressions[expression] > mostProbableExpression) {
          mostProbableExpression = detections[0].expressions[expression];
          _expression = expression;
        }
      }

      // Count expression occurrence
      setExpressionCounts((prev) => ({
        ...prev,
        [_expression]: (prev[_expression] || 0) + 1,
      }));
      setLastExpression(_expression);
      setTotalDetections((prev) => prev + 1);
    }, 100); // detect every 1 sec
  };

  const stopDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    setTracking(false);

    // Calculate percentages
    const summary = {};
    for (const [exp, count] of Object.entries(expressionCounts)) {
      summary[exp] = ((count / totalDetections) * 100).toFixed(2);
    }
    setResults(summary);

    // 🔥 Send results to API
    axios
      .post("http://localhost:3000/api/results", { results: summary })
      .then((res) => {
        console.log("Results saved:", res.data);
      })
      .catch((err) => {
        console.error("Error saving results:", err);
      });
  };

  const resetDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    setTracking(false);
    setExpressionCounts({});
    setTotalDetections(0);
    setResults(null);
    setLastExpression(null);
  };

  return (
    <>
      {isDesktop && <ChatHeader title={title} />}
   
    <div className="face-main">

   
    <div className="facemoddy-page">
    
      <div className="facemoddy-layout">
         <main className="video-panel">
          <video className="facemoddyVideo" ref={videoRef} autoPlay muted />
          <div className="controls">
            <button className="facemoddy-btn" onClick={() => {
              if (!tracking) startDetection(); else stopDetection();
            }}>{tracking ? 'Pause Detection' : 'Start Detection'}</button>
            <button className="facemoddy-btn secondary" onClick={resetDetection}>Reset</button>
            <button className={`facemoddy-btn ${cameraOn ? '' : 'secondary'}`} onClick={() => {
              if (cameraOn) {
                stopCamera();
              } else {
                startVideo();
              }
            }}>{cameraOn ? 'Camera Off' : 'Camera On'}</button>
          </div>
        </main>
        <aside className="results-panel">
          <h2>Live Results</h2>
          <div className="summary-card">
            <div className="summary-meta">
              <div>Detections</div>
              <div>{totalDetections}</div>
            </div>
            <div className="summary-meta">
              <div>Tracking</div>
              <div>{tracking ? "Active" : "Idle"}</div>
            </div>
            <div className="summary-meta">
              <div>Last</div>
              <div>{lastExpression || "—"}</div>
            </div>
          </div>

          <div className="expressions-list">
            {Object.keys(expressionCounts).length === 0 ? (
              <div className="no-detections">No detections yet. Click Start to begin.</div>
            ) : (
              Object.entries(expressionCounts).map(([exp, count]) => {
                const pct = totalDetections ? Math.round((count / totalDetections) * 100) : 0;
                return (
                  <div key={exp} className="expression-row">
                    <div className="expression-name">{exp}</div>
                    <div className="expression-stats">
                      <div className="bar-wrap">
                        <div className="bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="count-badge">{pct}%</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem' }}>
            <button className="facemoddy-btn secondary" onClick={resetDetection}>Reset</button>
            <button className="facemoddy-btn" onClick={() => {
              if (!tracking) startDetection(); else stopDetection();
            }}>{tracking ? 'Stop' : 'Start'}</button>
            <button className={`facemoddy-btn ${cameraOn ? '' : 'secondary'}`} onClick={() => {
              if (cameraOn) stopCamera(); else startVideo();
            }}>{cameraOn ? 'Camera Off' : 'Camera On'}</button>
          </div>
        </aside>

       
      </div>
    </div>
     </div>
      </>
  );
}