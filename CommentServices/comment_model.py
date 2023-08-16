from pydantic import Field,BaseModel


class CommentDto(BaseModel):
    content:str = Field(min_length=1, max_length=255)
    user_id:str =Field(min_length=1, max_length=50,alias="userId")
    post_id:str =Field(min_length=1, max_length=50,alias="postId")
   