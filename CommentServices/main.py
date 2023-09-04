from fastapi import FastAPI,status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine,Base,Session
from Comment import Comment
from comment_model import CommentDto
from comment_service import CommentService


app = FastAPI()
Base.metadata.create_all(bind=engine)


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

db = Session()


comment_service = CommentService(db)

@app.get("/comment/{id}")
def getComment(id:str):
    return comment_service.find_all_by_id(id)

@app.post("/comment")
def postComment(comment:CommentDto):
    comment_service.create(comment)
    return JSONResponse(status_code=status.HTTP_201_CREATED , content="Created")
