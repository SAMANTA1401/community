from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from websocket.models import Channel , Message
from websocket.database import SessionLocal, engine, get_db  # Your DB connection setup
from websocket.websockets import ConnectionManager
from websocket.utils import ChannelCreate, ChannelType, ChannelOut   # Your Pydantic models
import json
from sqlalchemy.exc import SQLAlchemyError
import time
from datetime import datetime
from typing import List
import os
import uuid
from fastapi.staticfiles import StaticFiles
import socketio

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173"],  # ⚠️ For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")



clients = {}

manager = ConnectionManager()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)





@app.websocket("/ws/{channel_id}")
async def websocket_endpoint(websocket: WebSocket, channel_id: str, db: Session = Depends(get_db)):
    await manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print("data",data)

            try:
                parsed = json.loads(data)

                message = Message(
                    channel_id=parsed["channel_id"],
                    sender=parsed["sender"],
                    content=parsed["content"],
                    type=parsed.get("type", "text"),  # Store type
                    url=parsed.get("url")  # Store url
                )
                db.add(message)
                db.commit()

                broadcast_message = {
                    "sender": message.sender,
                    "content": message.content,
                    "channel_id": message.channel_id,
                    "timestamp": parsed.get("timestamp", datetime.utcnow().isoformat()),
                    "type": parsed.get("type", "text"),  # Include type
                    "url": parsed.get("url")  # Include url
                }
                print("Broadcasting message:", broadcast_message)
                # Send JSON message to clients
                await manager.broadcast(channel_id, json.dumps(broadcast_message))

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


@app.get("/channels/{channel_id}/messages")
def get_messages(channel_id: str, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.channel_id == channel_id).order_by(Message.timestamp).all()
    return [
        {
            "sender": msg.sender,
            "content": msg.content,
            "channel_id": msg.channel_id,
            "timestamp": msg.timestamp.isoformat(),
            "type": msg.type,
            "url": msg.url
        } for msg in messages
    ]



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
    return new_channel

@app.get("/channels", response_model=List[ChannelOut])
def get_channels(db: Session = Depends(get_db)):
    return db.query(Channel).all()


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):

    # file_id = str(uuid.uuid4())
    # saved_filename = f"{file_id}_{file.filename}"

    saved_filename = file.filename

    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {"filename": file.filename, "url": f"/uploads/{saved_filename}"}

@app.get("/files/{filename}")
def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'  # 👈 triggers download
    )

@app.get("/")
async def root():
    return {"message": "Socket.IO Whiteboard Server is running"}

sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
app = socketio.ASGIApp(sio, app)


@sio.event
async def connect(sid, environ):
    print(f"✅ Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")

@sio.event
async def draw(sid, data):
    await sio.emit('draw', data, skip_sid=sid)  # Broadcast to all others

@sio.event
async def clear(sid):
    await sio.emit('clear', skip_sid=sid)

# This allows FastAPI routes if needed



# uvicorn main:app --host 0.0.0.0 --port 8000 --reload