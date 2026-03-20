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

@app.get("/stausBar/SetEventbutton")
async def returnOPMODEState():
    state=r.get("op_mode")
    print(state)
    return {"The_state_is": state}

@app.get("/{button_number}")
async def returnMainState(button_number: int):
    return {"The Button_number": button_number}

@app.get("/button/sidebarButtonState")
async def getSidebarButtonState():
    lastbutton=r.get("lastButton")
    if lastbutton:
        lastbutton = lastbutton.decode()
    return({"lastbutton":lastbutton})

@app.put("/button/setsidebarLastButton")
async def setsidebarLastButton(data: ButtonData):
    print("I recieved a request")
    try:
        r.set("lastButton", data.button_value)
        print(f"The lastbutton {data.button_value} is set in redis")
    except Exception as e:
        print(f"Error setting value in redis: {e}")