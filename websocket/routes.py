from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket.manager import ConnectionManager
from channels.models import Channel

ws_router = APIRouter()
manager = ConnectionManager()

@ws_router.websocket("/ws/{channel_id}")
async def websocket_endpoint(websocket: WebSocket, channel_id: int):
    await manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(channel_id, data)
    except WebSocketDisconnect:
        manager.disconnect(channel_id, websocket)
