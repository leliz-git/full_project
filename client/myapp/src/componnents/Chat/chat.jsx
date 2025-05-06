import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ייבוא useNavigate
import { jwtDecode } from 'jwt-decode';


const createSocketWithUsername = (username) => {
  return io("http://localhost:7002", {
    query: { username }, // שליחה של שם המשתמש לשרת כ-Query
  });
};

const Chat = () => {
  // const user = useSelector((state) => state.token.user); // שליפת פרטי המשתמש מ-Redux
  const accesstoken = useSelector((state) => state.token.token);
  const decoded = accesstoken ? jwtDecode(accesstoken) : null;
  const username = decoded.name || "משתמש לא מזוהה"; // שימוש בשם המשתמש או ערך ברירת מחדל
  const [socket, setSocket] = useState(null); // שמירת החיבור ל-Socket
  const [message, setMessage] = useState(""); // הודעה חדשה
  const [chatLog, setChatLog] = useState([]); // רשימת ההודעות
  const navigate = useNavigate(); // ניווט לדף אחר

  useEffect(() => {
    if (username) {
      const newSocket = createSocketWithUsername(username);
      setSocket(newSocket);

      // מאזין להודעות שמתקבלות מהשרת
      newSocket.on("receive_message", (data) => {
        console.log("הודעה התקבלה:", data);
        setChatLog((prev) => [...prev, data]);
      });

      return () => {
        newSocket.disconnect(); // ניתוק החיבור כשהרכיב מתפרק
      };
    }
  }, [username]);

  const sendMessage = () => {
    if (message.trim() === "" || !socket) return;

    const msgData = {
      text: message,
    };

    socket.emit("send_message", msgData); // שליחת הודעה לשרת
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCloseChat = () => {
    navigate(-1); // חזרה לדף הקודם
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            position: "relative", // כדי למקם את כפתור הסגירה
          }}
        >
          🗨️ צ'אט
          <button
            onClick={handleCloseChat}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>

        <div
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  msg.sender === username ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  backgroundColor:
                    msg.sender === username ? "#e6f7ff" : "#f1f1f1",
                  maxWidth: "70%",
                  textAlign: "left",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <strong style={{ color: "#007bff" }}>{msg.sender}</strong>:{" "}
                {msg.text}
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#888",
                    marginTop: "5px",
                  }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px",
            borderTop: "1px solid #ccc",
            backgroundColor: "#f7f7f7",
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="הקלד הודעה..."
            style={{
              width: "75%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            שלח
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;