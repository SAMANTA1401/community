import React, { useEffect, useState, useRef } from "react";
import FilePreview from "./FilePreview";
import Whiteboard from "./Whiteboard";

function ChatRoom({ channelId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Load cached messages
    const cached = localStorage.getItem(`messages_${channelId}`);
    if (cached) {
      const parsed = JSON.parse(cached).map((msg) => ({
        ...msg,
        type: msg.type || (msg.url ? "file" : "text"),
        url: msg.url || "",
      }));
      console.log("Cached messages with fix:", parsed); // Debug log
      setMessages(parsed);
    }
  }, [channelId]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`http://localhost:8000/channels/${channelId}/messages`);
        const data = await res.json();
  
        // Save to local storage
        localStorage.setItem(`messages_${channelId}`, JSON.stringify(data));
  
        setMessages(
          data.map((msg) => ({
            ...msg,
            type: msg.type || (msg.url ? "file" : "text"),
            url: msg.url || "",
          }))
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }
  
    fetchMessages();
  }, [channelId]);
  

  

  useEffect(() => {
    // Setup WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/ws/${channelId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.timestamp === message.timestamp &&
            m.sender === message.sender &&
            m.content === message.content
        );
        if (exists) return prev;

        const updated = [...prev, message];
        localStorage.setItem(`messages_${channelId}`, JSON.stringify(updated));
        return updated;
      });
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [channelId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, cannot send message");
      return;
    }

    if (/\.(pdf|jpg|jpeg|png|gif)$/i.test(text)) {
      // You said no alert, but maybe a console warning
      console.warn("Looks like a file name, please use file upload.");
      return;
    }

    const message = {
      sender: username,
      content: text,
      channel_id: channelId,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    try {
      socketRef.current.send(JSON.stringify(message));
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
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

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      const message = {
        sender: username,
        content: file.name,
        type: "file",
        url: data.url,
        channel_id: channelId,
        timestamp: new Date().toISOString(),
      };

      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket not connected, cannot send file message");
        return;
      }

      socketRef.current.send(JSON.stringify(message));
    } catch (err) {
      console.error("File upload error:", err);
      // You asked no alert, so just console error
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender}</strong>:{" "}
            {msg.type === "file" ? (
              <div>
                <FilePreview url={`http://localhost:8000${msg.url}`} filename={msg.content} />
                
                {/* 📥 Download button */}
                <a
                  href={`http://localhost:8000/files/${msg.content}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button style={{ marginTop: "0.5rem" }}>Download</button>
                </a>
              </div>
            ) : (
              msg.content
            )}

            <div style={{ fontSize: "0.75rem", color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      
      <div
        style={{
          display: "flex",
          padding: "1rem",
          borderTop: "1px solid #ccc",
          gap: "0.5rem",
        }}
      >
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
    <div>
        <h2>Group Study Whiteboard</h2>
        <Whiteboard groupId= {channelId} />
    </div>
    </div>
  );
}

export default ChatRoom;
