import React, { useEffect, useState, useRef } from "react";
import FilePreview  from "./FilePreview";


function ChatRoom({ channelId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // 🔹 Load messages from localStorage on first render
  useEffect(() => {
    const cached = localStorage.getItem(`messages_${channelId}`);
    if (cached) {
      const parsed = JSON.parse(cached).map((msg) => ({
        ...msg,
        type: msg.type || (msg.url ? "file" : "text"), // Fallback for old messages
        url: msg.url || "", // Ensure url is not undefined
      }));
      console.log("Cached messages with fix:", parsed); // Debug log
      setMessages(parsed);
    }
  }, [channelId]);

  // 🔹 Connect WebSocket and listen for new messages
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${channelId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some(
          (m) => m.timestamp === message.timestamp && m.sender === message.sender && m.content === message.content
        );
        if (exists) return prev;

        const updated = [...prev, message];
        localStorage.setItem(`messages_${channelId}`, JSON.stringify(updated));
        return updated;
      });
    };

    return () => ws.close();
  }, [channelId]);

  // 🔹 Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    // Warn if text looks like a filename
    if (/\.(pdf|jpg|jpeg|png|gif)$/i.test(text)) {
      alert("Did you mean to upload a file? Use the file input for files.");
      return;
    }

    const message = {
      sender: username,
      content: text,
      channel_id: channelId,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    socketRef.current?.send(JSON.stringify(message));
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Upload response:", data); // Debug log

      const message = {
        sender: username,
        content: file.name,
        type: "file",
        url: data.url,
        channel_id: channelId,
        timestamp: new Date().toISOString(),
      };
      console.log(message)
      console.log("Sending WebSocket message:", message); // Debug log

      socketRef.current?.send(JSON.stringify(message));
    } catch (err) {
      alert("File upload failed.");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg, idx) => {
          console.log("Message object:", { idx, sender: msg.sender, type: msg.type, content: msg.content, url: msg.url }); // Debug log
          return (
            <div key={idx} style={{ marginBottom: "0.5rem" }}>
              <strong>{msg.sender}</strong>:{" "}
              {msg.type === "file" ? (
                <FilePreview url={`http://localhost:8000${msg.url}`} filename={msg.content} />
              ) : (
                msg.content
              )}
              <div style={{ fontSize: "0.75rem", color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              </div>
            );
        })}

        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", padding: "1rem", borderTop: "1px solid #ccc", gap: "0.5rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <input type="file" onChange={handleFileUpload} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
