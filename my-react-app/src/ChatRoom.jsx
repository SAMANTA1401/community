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
      try {
        const msg = JSON.parse(event.data);
        const display = `${msg.sender}: ${msg.content}`;
        setMessages((prev) => [...prev, display]);
      } catch (err) {
        console.error("Failed to parse message", err);
        setMessages((prev) => [...prev, event.data]); // fallback
      }
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
      const message = {
        sender: username,
        content: inputValue,
        channel_id: channelId
      };
      ws.current.send(JSON.stringify(message));
      setInputValue(""); // clear input
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
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
