import React, { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";  // Adjust if different

function App() {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [channelId, setChannelId] = useState(null);

  // Fetch all active channels on load
  useEffect(() => {
    axios.get("http://localhost:8000/channels")
      .then(res => {
        console.log("Fetched channels:", res.data); // Debug log
        setChannels(res.data);
      })
      .catch(err => console.error("Error fetching channels", err));
  }, []);
  

  // Handle chat join
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== "" && channelId !== null) {
      setSubmitted(true);
    }
  };

  // Handle channel creation
  const handleCreateChannel = () => {
    if (!newChannelName.trim() || !username.trim()) return;

    const payload = {
      name: newChannelName,
      description: "",           // Optional: Add input field if needed
      created_by: username
    };

    axios
      .post(`${BACKEND_URL}/channels`, payload)
      .then((res) => {
        setChannels((prev) => [...prev, res.data]);
        setChannelId(res.data.id); // Auto-select created channel
        setNewChannelName("");
      })
      .catch((err) => {
        console.error("Channel creation failed", err);
        alert(err.response?.data?.detail || "Error creating channel");
      });
  };

  if (!submitted) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Join or Create a Channel</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            required
            style={{ marginRight: "0.5rem" }}
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
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleCreateChannel}>Create</button>
        </div>

        <div>
          <h4>Available Channels</h4>
          <ul>
            {channels.map((channel) => (
              <li
                key={channel.id}
                onClick={() => setChannelId(channel.id)}
                style={{ cursor: "pointer" }}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ChatRoom channelId={channelId} username={username} />
    </div>
  );
}

export default App;
