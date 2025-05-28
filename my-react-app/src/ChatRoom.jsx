import React, { useEffect, useState, useRef } from "react";

function ChatRoom({ channelId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // 🔹 Load messages from localStorage on first render
  useEffect(() => {
    const cached = localStorage.getItem(`messages_${channelId}`);
    if (cached) setMessages(JSON.parse(cached));
  }, [channelId]);

  // 🔹 Connect WebSocket and listen for new messages
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${channelId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => {
        const updated = [...prev, message];
        localStorage.setItem(`messages_${channelId}`, JSON.stringify(updated)); // update cache
        return updated;
      });
    };

    return () => ws.close();
  }, [channelId]);

  // 🔹 Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔹 Send a message
  const sendMessage = () => {
    if (!text.trim()) return;

    const message = {
      sender: username,
      content: text,
      channel_id: channelId,
      timestamp: new Date().toISOString(),
    };

    socketRef.current?.send(JSON.stringify(message));

    // Optimistic UI update
    // setMessages((prev) => {
    //   const updated = [...prev, message];
    //   localStorage.setItem(`messages_${channelId}`, JSON.stringify(updated));
    //   return updated;
    // });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender}</strong>: {msg.content}
            <div style={{ fontSize: "0.75rem", color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ flex: 1, marginRight: "0.5rem" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
