from database import Base
from sqlalchemy import Column,DateTime,String
import uuid
from datetime import datetime

class Comment(Base):
    __tablename__="comment"
    id = Column(String, primary_key=True, default=uuid.uuid4)
    content = Column(String,nullable=False)
    user_id =Column(String,nullable=False)
    post_id =Column(String,nullable=False)
    deleted =Column(String,nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
   