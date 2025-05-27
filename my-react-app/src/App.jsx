import React, { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [channelId, setChannelId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/active-channels")
      .then(res => setChannels(res.data.channels))
      .catch(err => console.error("Error fetching channels", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== "" && String(channelId).trim() !== "") {
      setSubmitted(true);
    }
  };

  if (!submitted) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Enter your username and channel</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="number"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Channel ID"
          />
          <button type="submit">Join Chat</button>
        </form>

        {channels.map((channel) => (
          <li
            key={channel.id}
            onClick={() => setChannelId(channel.id)}
            style={{ cursor: "pointer" }}
          >
            {channel.title}
          </li>
        ))}

      </div>
    );
  }

  return (
    <div className="App">
      <ChatRoom channelId={parseInt(channelId)} username={username} />
    </div>
  );
}

export default App;
