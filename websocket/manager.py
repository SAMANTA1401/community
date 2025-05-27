from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}  # channel_id -> [connections]

    async def connect(self, channel_id: int, websocket: WebSocket):
        await websocket.accept()
        if channel_id not in self.active_connections:
            self.active_connections[channel_id] = []
        self.active_connections[channel_id].append(websocket)

    def disconnect(self, channel_id: int, websocket: WebSocket):
        self.active_connections[channel_id].remove(websocket)
        if not self.active_connections[channel_id]:
            del self.active_connections[channel_id]

    async def broadcast(self, channel_id: int, message: str):
        if channel_id in self.active_connections:
            for connection in self.active_connections[channel_id]:
                await connection.send_text(message)

manager = ConnectionManager()