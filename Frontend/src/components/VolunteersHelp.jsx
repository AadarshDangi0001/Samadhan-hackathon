import React, { useState, useEffect } from "react";
import "./Volunteer.css";
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext"; 
const VolunteersHelp = ({title}) => {
  // toggle this to true when backend is ready
  const useBackend = false; 
   const { user,isDesktop  } = useUser(); 

  // dummy data for UI
  const dummyPosts = [
  {
    id: 1,
    comment: "Fees ka last date kab hai?",
    date: "2025-09-12",
    time: "10:15 AM",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rahul Verma",
    username: "@rahulv"
  },
  {
    id: 2,
    comment: "Scholarship students ke liye bhi late fine lagta hai kya?",
    date: "2025-09-12",
    time: "10:18 AM",
    profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Anjali Sharma",
    username: "@anjali_s"
  },
  {
    id: 3,
    comment: "Mera B.Sc 1st year exam timetable bata do.",
    date: "2025-09-13",
    time: "02:05 PM",
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
    name: "Amit Yadav",
    username: "@amit_y"
  },
  {
    id: 4,
    "comment": "Hostel warden ka contact number chahiye.",
    "date": "2025-09-13",
    "time": "07:42 PM",
    "profilePic": "https://randomuser.me/api/portraits/women/28.jpg",
    "name": "Pooja Patel",
    "username": "@pooja_p"
  },
  {
    "id": 5,
    "comment": "Migration certificate ke liye process kya hai?",
    "date": "2025-09-14",
    "time": "11:30 AM",
    "profilePic": "https://randomuser.me/api/portraits/men/50.jpg",
    "name": "Rohan Mehta",
    "username": "@rohanm"
  },
  {
    "id": 6,
    "comment": "Mujhe HOD ko leave ke liye ek application draft karni hai.",
    "date": "2025-09-14",
    "time": "05:10 PM",
    "profilePic": "https://randomuser.me/api/portraits/men/60.jpg",
    "name": "Karan Singh",
    "username": "@karan_s"
  }
]

  const [posts, setPosts] = useState(useBackend ? [] : dummyPosts);
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch posts from backend if enabled
  useEffect(() => {
    if (useBackend) {
      const fetchPosts = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/posts"); // change to your backend URL
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      fetchPosts();
    }
  }, [useBackend]);

  // ✅ Handle send → backend or local
  const handleSend = async () => {
    if (newComment.trim() === "") return;

    const newPost = {
      id: Date.now(),
      name: "You",
      profile: "https://via.placeholder.com/40",
      comment: newComment,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (useBackend) {
      try {
        const response = await fetch("http://localhost:5000/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        });

        if (!response.ok) throw new Error("Failed to save post");
        const savedPost = await response.json();

        setPosts([savedPost, ...posts]);
        setNewComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } else {
      // just update local UI
      setPosts([newPost, ...posts]);
      setNewComment("");
    }
  };


  return (
    <>
      {isDesktop && <ChatHeader  title={title} />}
    <div id="volunteer">
      <div id="volunteer-list">
        {posts.map((post) => (
          <div id="volunteer-card" key={post.id}>
            <div id="card-header">
              <img id="profile-pic" src={post.profile} alt="profile" />
              <span id="username">{post.name}</span>
            </div>
            <p id="comment">{post.comment}</p>
            <div id="card-footer">
              <span id="time">
                {post.time} · {post.date}
              </span>
              <span id="reply">See Replies</span>
            </div>
          </div>
        ))}
      </div>

      <div id="chat-box">
        <input
          id="chat-input"
          type="text"
          placeholder="Send Your Doubt..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button id="send-btn" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
    </>
  );
};

export default VolunteersHelp;
