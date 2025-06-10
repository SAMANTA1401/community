# Request model
from pydantic import BaseModel
from datetime import datetime

class ChannelCreate(BaseModel):
    name: str

# Response model
class ChannelType(BaseModel):
    id: str
    name: str

class ChannelCreate(BaseModel):
    name: str
    description: str = ""
    created_by: str 


class ChannelOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    created_by: str
    created_at: datetime

    class Config:
        orm_mode = True