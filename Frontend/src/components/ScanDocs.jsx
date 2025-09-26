import React, { useRef, useState } from "react";
import "./ScanDocs.css";
import rectangle from "../assets/Rectangle 5.png";
import boy from "../assets/image 16.png";
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext";

const ScanDocs = ({ title }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { isDesktop } = useUser();

  const [isDesktopCamera, setIsDesktopCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Desktop camera
  const openDesktopCamera = async () => {
    try {
      setIsDesktopCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Webcam error:", err);
      alert("Camera access blocked or unavailable");
      setIsDesktopCamera(false);
    }
  };

  // ✅ Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      stopCamera();
      uploadFileOrImage(imageData, true);
    }
  };

  // ✅ Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsDesktopCamera(false);
  };

  // ✅ Handle file selection
  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF) or PDF');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      
      uploadFileOrImage(file, false);
    }
  };

  // ✅ Upload to backend
  const uploadFileOrImage = async (data, isBase64 = false) => {
    try {
      setLoading(true);
      setSummary("");

      const formData = new FormData();
      if (isBase64) {
        // Convert base64 to blob
        const response = await fetch(data);
        const blob = await response.blob();
        // backend expects field name `image`
        formData.append("image", blob, "capture.png");
      } else {
        // backend expects `image` field name
        formData.append("image", data);
      }

      // POST to backend post API which creates a post and returns caption
      const uploadResponse = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        body: formData,
        // include cookies for auth (backend sets token cookie)
        credentials: "include",
      });

      if (!uploadResponse.ok) {
        throw new Error(`HTTP error! status: ${uploadResponse.status}`);
      }

      const result = await uploadResponse.json();
      // backend createPostController returns { message, post: { caption } }
      const caption = result?.post?.caption || result?.caption || result?.summary;
      setSummary(caption || "No summary found.");
    } catch (err) {
      console.error("Upload error:", err);
      setSummary("❌ Error while summarizing document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle camera input click
  const handleCameraInputClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Helper: escape HTML to avoid XSS
  const escapeHtml = (unsafe) => {
    if (!unsafe && unsafe !== 0) return "";
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Helper: parse very small subset of markdown - bold **text** only
  const renderSummaryWithBold = (text) => {
    if (!text && text !== 0) return null;
    const escaped = escapeHtml(text);
    // Split by bold markers while keeping the matches
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(escaped)) !== null) {
      const idx = match.index;
      if (idx > lastIndex) {
        parts.push(escaped.slice(lastIndex, idx));
      }
      parts.push({ bold: match[1] });
      lastIndex = idx + match[0].length;
    }
    if (lastIndex < escaped.length) {
      parts.push(escaped.slice(lastIndex));
    }

    // Build React nodes
    return parts.map((p, i) =>
      typeof p === "string" ? (
        <span key={i}>{p}</span>
      ) : (
        <strong key={i}>{p.bold}</strong>
      )
    );
  };

  return (
    <>
      {isDesktop && <ChatHeader title={title} />}
    <div className="ScanDocs">
      <div className="scan-container">
    
          <img className="rec" src={rectangle} alt="" />
          <img className="boy" src={boy} alt="" />
          <p className="bg-text">
            Upload or Scan your Docs for clear understanding
          </p>
       </div>

        <div className="files">
          {/* ✅ File upload - Fixed */}
          <div className="file-upload" onClick={handleFileInputClick}>
            <div className="file-upload-icon">📁</div>
            <span>Select file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.gif"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                handleFileSelect(file);
                // Reset input value to allow same file selection
                e.target.value = '';
              }}
            />
          </div>

          <div className="orpara">
            <div className="line"></div>
            <p className="or">or</p>
             <div className="line"></div>
          </div>

       

          {/* ✅ Mobile camera → only show when NOT desktop - Fixed */}
          {!isDesktop && (
            <div className="camera" onClick={handleCameraInputClick}>
              <i className="ri-camera-fill"></i>
              <p className="camtext">Open Camera & Take Photo</p>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  handleFileSelect(file);
                  // Reset input value
                  e.target.value = '';
                }}
              />
            </div>
          )}

          {/* ✅ Desktop camera → only show on desktop */}
          {isDesktop && !isDesktopCamera && (
            
            <button
              type="button"
              className="desktop-btn"
              onClick={openDesktopCamera}
            >
                            <i className="ri-camera-fill"></i>
 Open Camera and take photo
            </button>
          )}

          {isDesktopCamera && (
            <div className="desktop-camera">
              <video ref={videoRef} autoPlay playsInline />
              <div className="desktop-controls">
                <button type="button" onClick={capturePhoto}>
                  Capture
                </button>
                <button type="button" onClick={stopCamera}>
                  Cancel
                </button>
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
          )}

          {capturedImage && (
            <div className="preview">
              <img src={capturedImage} alt="Captured" />
            </div>
          )}

          </div>
          {/* ✅ Output */}
          <div className="out-text">
            <p>Output</p>
          </div>
          <div className="output">
            {loading ? (
              <p>⏳ Summarizing...</p>
            ) : (
              <p>{renderSummaryWithBold(summary)}</p>
            )}
        </div>
      </div>
   
    </>
  );
};

export default ScanDocs;