from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from websocket import websockets, models
from websocket.database import SessionLocal, engine, get_db  # Your DB connection setup
from websockets import manager


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = {}

@app.websocket("/ws/{channel_id}")
async def websocket_endpoint(websocket: WebSocket, channel_id: int, db: Session = Depends(get_db)):
    await manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()

            message = models.Message(
                channel_id=channel_id,
                sender="Anonymous",  # Replace with actual user auth if needed
                content=data
            )
            db.add(message)
            db.commit()

            # Send JSON message to clients
            await manager.broadcast(
                channel_id,
                json.dumps({
                    "sender": message.sender,
                    "content": message.content
                })
            )
    except WebSocketDisconnect:
        manager.disconnect(channel_id, websocket)