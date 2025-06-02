import React, { useEffect, useState } from "react";

function ChannelList({ onSelectChannel, currentChannelId, currentUser = "guest" }) {
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChannelName, setNewChannelName] = useState("");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch("http://localhost:8000/channels");
        const data = await res.json();
        setChannels(data);
      } catch (err) {
        console.error("Failed to fetch channels", err);
      }
    };
    fetchChannels();
  }, []);

  const createChannel = async () => {
    const name = newChannelName.trim();
    if (!name) return;

    try {
      const res = await fetch("http://localhost:8000/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: "",
          created_by: currentUser,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error: ${error.detail}`);
        return;
      }

      const newChannel = await res.json();
      setChannels((prev) => [...prev, newChannel]);
      setNewChannelName(""); // Clear input after creation
    } catch (err) {
      console.error("Channel creation error:", err);
    }
  };

  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      width: "250px",
      borderRight: "1px solid #343a40",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#212529",
      color: "white",
    }}>
      <h3 style={{textAlign:"center"}}>AiClassmate</h3>
      <h4 style={{textAlign:"center"}}>{currentUser}</h4>

      <div style={{ padding: "1rem", borderBottom: "1px solid #343a40" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search channels..."
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #555",
            backgroundColor: "#343a40",
            color: "white",
            fontSize: "18px"
          }}
        />
        <input
          type="text"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="New channel name"
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #555",
            backgroundColor: "#343a40",
            color: "white",
            fontSize: "18px"
          }}
        />
        <button
          onClick={createChannel}
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          + Create Channel
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            style={{
              padding: "0.75rem",
              cursor: "pointer",
              backgroundColor: currentChannelId === channel.id ? "#495057" : "transparent",
              color: "white",
              borderBottom: "1px solid #343a40",
              fontSize: "18px"
            }}
          >
            #{channel.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChannelList;
