
from database import Session
from Comment import Comment
from comment_model import CommentDto
from fastapi import HTTPException


class CommentService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def find_all_by_id(self, id: str):
        return self.db.query(Comment).filter(Comment.post_id == id).all()

    def create(self, comment: CommentDto):
        try:
            comment_db = Comment(**comment.model_dump())
            self.db.add(comment_db)
            self.db.commit()
        except Exception:
            raise HTTPException(
                status_code=500, detail="Error Creating Comment ")
