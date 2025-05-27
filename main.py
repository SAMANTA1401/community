from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from websocket import websockets, models
from websocket.database import SessionLocal, engine, get_db  # Your DB connection setup
from websocket.websockets import ConnectionManager
import json
from sqlalchemy.exc import SQLAlchemyError


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173"],  # ⚠️ For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = {}

manager = ConnectionManager()

@app.websocket("/ws/{channel_id}")
async def websocket_endpoint(websocket: WebSocket, channel_id: int, db: Session = Depends(get_db)):
    await manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()

            try:
                parsed = json.loads(data)

                message = models.Message(
                    channel_id=parsed["channel_id"],
                    sender=parsed["sender"],
                    content=parsed["content"]
                )
                db.add(message)
                db.commit()

                # Send JSON message to clients
                await manager.broadcast(channel_id, json.dumps({
                    "sender": message.sender,
                    "content": message.content,
                    "channel_id": message.channel_id
                }))

            except SQLAlchemyError as e:
                db.rollback()
                print("❌ DB Error:", e)
                await websocket.send_text(json.dumps({"sender": "System", "content": "Error saving message."}))

    except WebSocketDisconnect:
        manager.disconnect(channel_id, websocket)
        print("📴 WebSocket disconnected")
    except Exception as e:
        print("❌ Unexpected error:", e)
        manager.disconnect(channel_id, websocket)

active_channels = [
    {"id": 1, "title": "General"},
    {"id": 2, "title": "Tech Talk"},
]

@app.get("/active-channels")
def get_active_channels():
    # return {"channels": active_channels}
    return {"channels": manager.get_active_channels()}
