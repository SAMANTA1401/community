import React, { useEffect, useState, useRef } from "react";
import FilePreview from "./FilePreview";
import Whiteboard from "./Whiteboard";
import { getMessages, saveMessages } from "./indexedDB";

function ChatRoom({ channelId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const normalizeMessage = (msg) => {
    const isFile = msg.type === "file" || (msg.url && msg.url.includes("/uploads/"));
    return {
      ...msg,
      type: isFile ? "file" : "text",
      url: msg.url || "",
      f_content: msg.f_content || (isFile && msg.url ? msg.url.split("/").pop() : null),
    };
  };

  useEffect(() => {
    (async () => {
      const cached = await getMessages(channelId);
      if (cached) {
        setMessages(cached.map(normalizeMessage));
      }
    })();
  }, [channelId]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`http://localhost:8000/channels/${channelId}/messages`);
        const data = await res.json();
        const normalized = data.map(normalizeMessage);

        await saveMessages(channelId, normalized);

        setMessages(normalized);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    fetchMessages();
  }, [channelId]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${channelId}`);
    socketRef.current = ws;
  
    ws.onopen = () => console.log("WebSocket connected");
  
    ws.onmessage = async (event) => {
      const raw = JSON.parse(event.data);
      const message = normalizeMessage(raw);
  
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.timestamp === message.timestamp &&
            m.sender === message.sender &&
            m.content === message.content
        );
        if (exists) return prev;
  
        const updated = [...prev, message];
        // Save to IndexedDB outside of setState
        saveMessages(channelId, updated);
        return updated;
      });
    };
  
    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");
  
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
      console.warn("Looks like a file name, please use file upload.");
      return;
    }

    const message = {
      sender: username,
      content: text,
      f_content: null,
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
    formData.append("channel_id", channelId);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      const message = {
        sender: username,
        content: data.filename,
        f_content: data.saved_as,
        type: "file",
        url: data.url,
        channel_id: channelId,
        timestamp: new Date().toISOString(),
      };

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket not connected, cannot send file message");
      }
    } catch (err) {
      console.error("File upload error:", err);
    }
  };

  const handleDownload = async (chanel , filename) => {
    try {
      const response = await fetch(`http://localhost:8000/files/${chanel}/${filename}`);
      if (!response.ok) throw new Error("File download failed");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const originalName = filename.split("_").slice(1).join("_");

      console.log(originalName)
  
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%", width:"100%" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width:"100%"}}>
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "0.5rem" }}>
              <strong>{msg.sender}</strong>:{" "}
              {msg.type === "file" ? (
                <div>
                <a
                      href={`http://localhost:8000${msg.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                  <FilePreview url={`http://localhost:8000${msg.url}`} filename={msg.content} />
                  </a>
                  {msg.f_content && (
                    <button onClick={() => handleDownload(msg.channel_id,msg.f_content)} style={{ marginTop: "0.5rem" }}>
                    Download
                  </button>
                  
                  )}
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
            style={{ flex: 1, fontSize: "18px" , width:"300px"}}
          />
          <input type="file" onChange={handleFileUpload} style={{  fontSize: "18px", width:"200px" }} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <div style={{width:"100%"}}>
        <h2></h2>
        <Whiteboard groupId={channelId} />
      </div>
 
    </div>
  );
}

export default ChatRoom;
