# app/models.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Channel(Base):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("Message", back_populates="channel")
    join_requests = relationship("ChannelJoinRequest", back_populates="channel")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"))
    sender = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String, default="text")  # Ensure type field exists
    url = Column(String, nullable=True)    # Ensure url field exists
    timestamp = Column(DateTime, default=datetime.utcnow)

    channel = relationship("Channel", back_populates="messages")


class ChannelJoinRequest(Base):
    __tablename__ = "channel_join_requests"

    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"))
    user_id = Column(String)  # you can use username or user_id
    status = Column(String, default="pending")  # "pending", "approved", "rejected"

    # Optional relationships
    channel = relationship("Channel", back_populates="join_requests")