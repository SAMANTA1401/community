import React, { useEffect, useState } from "react";

function ChannelList({ onSelectChannel, currentChannelId, currentUser = "user1" }) {
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChannelName, setNewChannelName] = useState("");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`http://localhost:8000/channels?user=${currentUser}`);
        const data = await res.json();
        setChannels(data);
      } catch (err) {
        console.error("Failed to fetch channels", err);
      }
    };
    fetchChannels();
  }, [currentUser]); // Add currentUser as dependency in case it changes
  

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
    <div
      style={{
        width: "250px", // slight increase for breathing room
        borderRight: "1px solid #343a40",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#212529",
        color: "white",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
      }}
    >
      <div
        style={{
          paddingTop: "2rem",
          borderBottom: "1px solid #343a40",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#f8f9fa" }}>
          AiClassmate
        </h2>
        <p style={{ margin: "0.5rem 0", fontSize: "1rem", color: "#adb5bd" }}>
          {currentUser}
        </p>
      </div>

      <div style={{ padding: "1rem", borderBottom: "1px solid #343a40",  marginRight: "1rem", }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search channels..."
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#343a40",
            color: "white",
            fontSize: "16px",
          
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
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#343a40",
            color: "white",
            fontSize: "16px",
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
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s ease",
            marginLeft: "0.5rem",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0b5ed7")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0d6efd")}
        >
          + Create Channel
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem 0",
        }}
      >
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            style={{
              padding: "0.75rem 1rem",
              cursor: "pointer",
              backgroundColor:
                currentChannelId === channel.id ? "#495057" : "transparent",
              color: "white",
              borderBottom: "1px solid #343a40",
              fontSize: "16px",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#495057")}
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                currentChannelId === channel.id ? "#495057" : "transparent")
            }
          >
            #{channel.name}
          </div>
        ))}
      </div>
    </div>

  );
}

export default ChannelList;
