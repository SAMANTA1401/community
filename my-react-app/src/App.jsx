import React, { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000"; // Adjust if needed

function App() {
  const [username, setUsername] = useState("");
  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [channelId, setChannelId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Load channels from server and localStorage
  useEffect(() => {
    const storedChannels = localStorage.getItem("channels");
    if (storedChannels) {
      setChannels(JSON.parse(storedChannels));
    }

    axios.get(`${BACKEND_URL}/channels`)
      .then(res => {
        setChannels(res.data);
        localStorage.setItem("channels", JSON.stringify(res.data));
      })
      .catch(err => console.error("Error fetching channels", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && channelId !== null) {
      setSubmitted(true);
    }
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim() || !username.trim()) return;

    const payload = {
      name: newChannelName,
      description: "",
      created_by: username,
    };

    axios.post(`${BACKEND_URL}/channels`, payload)
      .then((res) => {
        const updatedChannels = [...channels, res.data];
        setChannels(updatedChannels);
        localStorage.setItem("channels", JSON.stringify(updatedChannels));
        setChannelId(res.data.id);
        setNewChannelName("");
      })
      .catch((err) => {
        console.error("Channel creation failed", err);
        alert(err.response?.data?.detail || "Error creating channel");
      });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Pane - Channel Form (25%) */}
      <div style={{ width: "45%", padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h2>Join or Create a Channel</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            required
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <button type="submit" disabled={!channelId}>Join Chat</button>
        </form>

        <div style={{ marginBottom: "1rem" }}>
          <h4>Create New Channel</h4>
          <input
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Channel name"
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <button onClick={handleCreateChannel} style={{ width: "100%" }}>Create</button>
        </div>

        <div>
          <h4>Available Channels</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {channels.map((channel) => (
              <li
                key={channel.id}
                onClick={() => setChannelId(channel.id)}
                style={{
                  cursor: "pointer",
                  padding: "0.25rem 0",
                  fontWeight: channelId === channel.id ? "bold" : "normal",
                }}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Pane - Chat Window (75%) */}
      <div style={{ width: "55%", padding: "1rem" }}>
        {submitted && channelId && username ? (
          <ChatRoom channelId={channelId} username={username} />
        ) : (
          <div style={{ textAlign: "center", marginTop: "5rem" }}>
            <h2>Please join a channel to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
