import React, { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import ChannelList from "./ChannelList";
import GenerateRoadmap from "./GenerateRoadmap";

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
    <div style={{ display: "flex", flexDirection:"row", justifyContent: "center", alignItems: "center", height: "100vh", }}>
      <div style={{ display: "flex", height: "100vh", width: "90%", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" , backgroundColor:"#2e3134" }}>
        
        <div style={{ display: "flex", height: "100vh" }}>
        <div className="App">
          <h1 className="text-3xl font-bold text-center mt-6">AI Roadmap Generator</h1>
            <GenerateRoadmap />
          </div>
          {/* <ChannelList onSelectChannel={setChannelId} currentChannelId={channelId} />
          {channelId ? (
            <ChatRoom channelId={channelId} username={username} />
          ) : (
            <div style={{ padding: "2rem"}}>Select or create a channel to start chatting.</div>
          )} */}
        </div>


      </div>
    </div>
  );
  
}

export default App;
