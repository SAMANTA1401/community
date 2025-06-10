import React, { useEffect, useState } from "react";
import ChatRoom from "./community/ChatRoom";
import ChannelList from "./community/ChannelList";


function App() {
  const [channelId, setChannelId] = useState("");
  const [username, setUsername] = useState("user1");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",

        height: "100vh",
        backgroundColor: "#1e1e1e", // Optional: background for the whole page
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "95vh",
          width: "90%",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#2e3134",
        }}
      >
        <div
          style={{
            width: "250px",
            borderRight: "1px solid #555",
            backgroundColor: "#3a3d40", // Optional: slight background for sidebar
       
          }}
        >
          <ChannelList
            onSelectChannel={setChannelId}
            currentChannelId={channelId}
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {channelId ? (
            <ChatRoom channelId={channelId} username={username} />
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column" ,
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
       
       
                <strong>📢 Important Disclaimer:</strong><br />
                This app is for <strong>study-related communication only</strong><br />
                <strong>👉 Do NOT share personal, sensitive, or confidential information here.<br />
                Use this platform responsibly to maintain a safe learning environment.</strong><br />
                <strong>✨ Pick a channel or create a new one — your study chat awaits!</strong>
        
        

    
    
            </div>
          )}
        </div>
      </div>
    </div>

  );
  
}

export default App;
