import React from "react";
import "./About.css";
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext"; 

import img1 from "../assets/dashchar.png";
import img2 from "../assets/girl.png";
import img3 from "../assets/image 15.png";
import img4 from "../assets/kid.png";
import img5 from "../assets/singupCha.png";
import img6 from "../assets/loginCha.png";

const About = ({title}) => {
     const { user,isDesktop  } = useUser(); 
  
  return (
    <>
          {isDesktop && <ChatHeader  title={title} />}

    <div id="about-container">
      {/* Left images */}
      <div id="about-left">
        <img src={img1} alt="about" id="about-img" />
        <img src={img2} alt="about" id="about-img" />
        <img src={img3} alt="about" id="about-img" />
      </div>

      {/* Center text */}
      <div id="about-center">
        <h1>~About page</h1>
        <p id="about-text">
Welcome to Askly, the ultimate learning companion designed to transform your academic journey. We understand that traditional learning can be challenging, and that's why we’ve built a platform that caters to your individual needs with a holistic, technology-driven approach.

At its core, Askly is a comprehensive learning platform offering a revolutionary new way to study. Our core feature provides line-by-line explanations for any topic, turning complex subjects into clear, understandable concepts. Say goodbye to confusion and wasted hours spent trying to decipher textbooks. With Askly, you get clarity, a foundation for true mastery. We believe that learning shouldn't be limited to what's on a page, which is why our rich repository of provided resources ensures you always have the right materials at your fingertips, whether you're studying for an exam or simply exploring a new subject out of curiosity.

We know that students are always on the move, so your learning should be too. Our voice explanation feature allows you to listen to detailed breakdowns of topics, making it easy to learn while you're commuting, exercising, or just taking a break from the screen. And because we understand that reliable internet isn't always available, our offline mode lets you download and access key content anytime, anywhere. Your learning never has to stop, even when your connection does.

What makes Askly truly unique is our commitment to a personalized, supportive experience. Our integrated WhatsApp bot acts as your instant study buddy, ready to answer quick questions, provide helpful tips, and offer support whenever you need it. This feature brings the help you need directly to a platform you already use every day, making support immediate and accessible.


        </p>
      </div>

      {/* Right images */}
      <div id="about-right">
        <img src={img4} alt="about" id="about-img" />
        <img src={img5} alt="about" id="about-img" />
        <img style={{height:"10rem"}} src={img6} alt="about" className="img6kid" id="about-img" />
      </div>
    </div>
    </>
  );
};

export default About;
