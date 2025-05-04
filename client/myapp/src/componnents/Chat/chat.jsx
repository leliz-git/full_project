import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from 'react-redux'; // ייבוא useSelector
import { jwtDecode } from 'jwt-decode';

const socket = io("http://localhost:7002"); // שים לב לכתובת השרת

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const accesstoken = useSelector((state) => state.token.token);
  const decoded = accesstoken ? jwtDecode(accesstoken) : null;

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    // ניקוי מאזין כשעוזבים את הדף
    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    const msgData = {
      sender: "מתווך", // או "מוכר" לפי תפקיד
      text: message,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🗨️ צ'אט בין מתווך למוכר</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
        {chatLog.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}</strong>: {msg.text} <em>({msg.time})</em>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="הקלד הודעה..."
          style={{ width: "70%" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10 }}>שלח</button>
      </div>
    </div>
  );
};

export default Chat;