from fastapi import FastAPI
import redis 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

r =redis.Redis(host="localhost",port="6379")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ButtonData(BaseModel):
    button_value: str

@app.get("/stausBar/States")
async def returnCurrentStates():
    """
    This endpoint will return all states of the the Status Bar: Mode - Localization - Battery - OperationMode ...
    """  
    CurrentStates=r.get("all_topics")
    print(CurrentStates)
    return CurrentStates

