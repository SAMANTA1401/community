from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
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
from sqlalchemy import func


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
    # Normalize the name for duplicate checking (trim + lowercase)
    normalized_name = channel.name.strip().lower()

    # Check for case-insensitive duplicate
    existing = db.query(Channel).filter(func.lower(Channel.name) == normalized_name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Channel name already exists")

    new_channel = Channel(
        name=channel.name.strip(),  # Save trimmed version
        description=channel.description.strip() if channel.description else "",
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
async def upload_file(
    file: UploadFile = File(...),
    channel_id: str = Form(...)
):
    # Make directory for channel if not exists
    group_dir = os.path.join(UPLOAD_DIR, channel_id)
    os.makedirs(group_dir, exist_ok=True)

    # Save file with UUID to avoid filename clashes
    file_id = str(uuid.uuid4())
    saved_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(group_dir, saved_filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {
        "filename": file.filename,
        "saved_as": saved_filename,
        "url": f"/uploads/{channel_id}/{saved_filename}"
    }


@app.get("/files/{channel}/{filename}")
def download_file(channel: str, filename: str):
    # Secure file and channel names
    safe_filename = os.path.basename(filename)
    safe_channel = os.path.basename(channel)

    # Full path
    file_path = os.path.join(UPLOAD_DIR, safe_channel, safe_filename)
    print("Serving:", file_path)

    # Extract original name
    original_name = "_".join(safe_filename.split("_")[1:])
    print("Original name:", original_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Set Content-Disposition header to force download with original name
    return FileResponse(
        file_path,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{original_name}"'
        }
    )



@app.get("/")
async def root():
    return {"message": "Socket.IO Whiteboard Server is running"}

### white board server

sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
app = socketio.ASGIApp(sio, app)


user_rooms = {}

@sio.event
async def connect(sid, environ):
    print(f" Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f" Client disconnected: {sid}")
    if sid in user_rooms:
        await sio.leave_room(sid, user_rooms[sid])
        del user_rooms[sid]

@sio.event
async def join_group(sid, data):
    group_id = data["group_id"]
    await sio.enter_room(sid, group_id)
    user_rooms[sid] = group_id
    print(f" {sid} joined group {group_id}")

@sio.event
async def draw(sid, data):
    group_id = data["group_id"]
    await sio.emit('draw', data["line"], room=group_id, skip_sid=sid)

@sio.event
async def clear(sid, data):
    group_id = data["group_id"]
    await sio.emit('clear', {}, room=group_id, skip_sid=sid)



# uvicorn main:app --host 0.0.0.0 --port 8000 --reload