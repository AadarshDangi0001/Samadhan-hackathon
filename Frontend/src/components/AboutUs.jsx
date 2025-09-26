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
        In most colleges, students face a common problem: getting clear and quick answers to their everyday queries. Whether it’s about fees, forms, schedules, scholarships, or events, students often spend hours standing in queues, searching through notice boards, or waiting for faculty responses. To make matters harder, most notices and circulars are shared only in English, which isn’t always easy for every student to understand. This creates delays, confusion, and stress in campus life.

ASKLY is designed to change that. It is a multilingual chatbot that makes communication between students and faculty simple, fast, and inclusive. Instead of waiting for answers, students can ask their questions anytime—through the college website or even WhatsApp—and receive instant, reliable support.

One of the biggest strengths of ASKLY is that it works in multiple languages. Students can use English, Hindi, or their regional language to ask queries, and the chatbot responds clearly. This ensures that no student is left behind due to language barriers. ASKLY can also explain notices or circulars in simple words and even help students draft polite, professional emails for faculty.

For students, ASKLY provides 24/7 guidance, saving valuable time and reducing stress. For faculty and staff, it cuts down repetitive questions and reduces workload by up to 70%, allowing them to focus on more meaningful tasks. At the same time, ASKLY promotes eco-friendly, paperless communication across the campus.

Our vision is to build smarter, more inclusive campuses across India—where every student has equal access to information and feels supported in their educational journey. With ASKLY, communication becomes seamless, inclusive, and stress-free.

ASKLY is more than just a chatbot—it’s your campus assistant, always ready to help.
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
