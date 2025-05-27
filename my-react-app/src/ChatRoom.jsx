import React, { useState, useEffect, useRef } from "react";

const ChatRoom = ({ channelId, username }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${channelId}`);
    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, [channelId]);

  const sendMessage = () => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(`${username}: ${inputValue}`);
      setMessages((prev) => [...prev, `${username}: ${inputValue}`]);
      setInputValue("");
    } else {
      console.warn("WebSocket not open yet.");
    }
  };

  return (
    <div>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
