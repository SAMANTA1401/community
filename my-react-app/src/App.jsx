
import React, { useState } from "react";
import ChatRoom from "./ChatRoom";

function App() {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      setSubmitted(true);
    }
  };

  if (!submitted) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Enter your username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }


  return (
    <div className="App">
      <ChatRoom channelId={1} username={username} />
    </div>
  );
}

export default App;

// src/App.js


