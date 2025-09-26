import React from "react";
import "./ChatHeader.css"; // optional, you can use separate CSS

const ChatHeader = ({ title }) => {
    // Dummy data (replace with API/context later if needed)
    const user = {
        name: "Abhishek",
        rollno: "23CS101",
        profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    return (
        <div className="chat-header">
            <div className="text-1">
                <h2>~{title}</h2>
            </div>
            <div className="profile-1">
                <i className="ri-notification-line"></i>
                <div className="img-items">
                    <img src={user.profilePic} alt="profile" />
                    <div className="para">
                        <p>{user.name}</p>
                        <p className="roll">{user.rollno}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
