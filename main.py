from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from websocket.models import Channel , Message
from websocket.database import SessionLocal, engine, get_db  # Your DB connection setup
from websocket.websockets import ConnectionManager
from websocket.utils import ChannelCreate, ChannelType, ChannelOut  # Your Pydantic models
import json
from sqlalchemy.exc import SQLAlchemyError
import time
from datetime import datetime
from typing import List


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

                message = Message(
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
                print(" DB Error:", e)
                await websocket.send_text(json.dumps({"sender": "System", "content": "Error saving message."}))

    except WebSocketDisconnect:
        manager.disconnect(channel_id, websocket)
        print(" WebSocket disconnected")
    except Exception as e:
        print(" Unexpected error:", e)
        manager.disconnect(channel_id, websocket)




def generate_channel_id(name: str) -> str:
    return name.strip().lower().replace(" ", "-") + "-" + str(int(time.time()))


@app.post("/channels")
def create_channel(channel: ChannelCreate, db: Session = Depends(get_db)):
    # Check if name already exists
    existing = db.query(Channel).filter(Channel.name == Channel.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Channel name already exists")

    new_channel = Channel(
        name=channel.name,
        description=channel.description,
        created_by=channel.created_by,
        created_at=datetime.utcnow()
    )
    db.add(new_channel)
    db.commit()
    db.refresh(new_channel)
    # return {
    #     "id": new_channel.id,
    #     "name": new_channel.name
    # }
    return new_channel

@app.get("/channels", response_model=List[ChannelOut])
def get_channels(db: Session = Depends(get_db)):
    return db.query(Channel).all()


# active_channels = [
#     {"id": 1, "title": "General"},
#     {"id": 2, "title": "Tech Talk"},
# ]

# @app.get("/active-channels")
# def get_active_channels():
#     return {"channels": active_channels}
    # return {"channels": manager.get_active_channels()}
