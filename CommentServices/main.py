from fastapi import FastAPI



app = FastAPI()


@app.get("/comments")
def getComment():
    return "all comments"