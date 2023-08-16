from fastapi import FastAPI,status
from fastapi.responses import JSONResponse
from database import engine,Base,Session
from Comment import Comment
from comment_model import CommentDto


app = FastAPI()
Base.metadata.create_all(bind=engine)


db = Session()

@app.get("/comment/{id}")
def getComment(id:str):
    return db.query(Comment).filter(Comment.post_id == id).all()

@app.post("/comment")
def postComment(comment:CommentDto):
    comment_db = Comment(**comment.model_dump())
    db.add(comment_db)
    db.commit()
    return JSONResponse(status_code=status.HTTP_201_CREATED , content="Created")
