import React, { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";

function App() {
  const [channelId, setChannelId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [channels, setChannels] = useState([]);

  // Load channels from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("channel_list") || "[]");
    setChannels(saved);
  }, []);

  // Create or join a channel
  const handleJoin = () => {
    if (!channelId.trim() || !username.trim()) return;

    // Update channel list if new
    if (!channels.includes(channelId)) {
      const updated = [...channels, channelId];
      setChannels(updated);
      localStorage.setItem("channel_list", JSON.stringify(updated));
    }

    setJoined(true);
  };

  // Click existing channel
  const handleChannelClick = (id) => {
    setChannelId(id);
    setJoined(false); // Reset to rejoin
    setTimeout(() => setJoined(true), 50);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", padding: "1rem", borderRight: "1px solid #ccc", background:"rgb(26 26 26)"  }}>
        <h3>Username</h3>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          style={{ width: "90%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        <h3>Create/Join Group</h3>
        <input
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="Channel name"
          style={{ width: "90%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <button
          onClick={handleJoin}
          style={{
            width: "90%",
            padding: "0.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          {joined ? "Re-join Group" : "Join Group"}
        </button>

        <h3>Grooups</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {channels.map((ch) => (
            <li key={ch}>
              <button
                onClick={() => handleChannelClick(ch)}
                style={{
                  background: ch === channelId ? "#007bff" : "transparent",
                  color: ch === channelId ? "#fff" : "#fff",
                  padding: "0.5rem",
                  width: "90%",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              >
                #{ch}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1 }}>
        {joined && username && channelId ? (
          <ChatRoom channelId={channelId} username={username} />
        ) : (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Join or create a channel to start chatting!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
