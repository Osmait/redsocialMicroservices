from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status, Security
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import JWTError, jwt
from pydantic import ValidationError
from database import engine, Base, Session
from comment_model import CommentDto
from comment_service import CommentService


app = FastAPI()
Base.metadata.create_all(bind=engine)

origins = [

    "http://localhost:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "secreto"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read", "user": "write."},
)


async def get_current_id(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except (JWTError, ValidationError):
        raise credentials_exception


db = Session()


comment_service = CommentService(db)


@app.get("/comment/{id}")
async def getComment(id: str, current_user: Annotated[str, Security(get_current_id, scopes=["me"])]):
    print(current_user)
    comments = comment_service.find_all_by_id(id)
    return comments


@app.post("/comment")
def postComment(comment: CommentDto):
    comment_service.create(comment)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content="Created")
