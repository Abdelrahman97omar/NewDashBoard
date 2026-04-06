from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tableModeApi import router as table_mode_router 
from eventModeApi import router as event_mode_router 
from robotsettingsApi import router as robor_settings_router
import redis 
import json
app = FastAPI()
r =redis.Redis(host="localhost",port="6379")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/stausBar/States")
async def returnCurrentStates():
    """
    This endpoint will return all states of the the Status Bar: Mode - Localization - Battery - OperationMode ...
    """  
    CurrentStates=r.get("all_topics")
    print(CurrentStates)
    return CurrentStates

@app.get("/control/getRobotSpeed")
async def get_motor_speed():
    CurrentStates=r.get("all_topics")
    CurrentStates=json.load(CurrentStates)
    print(CurrentStates["robot_speed"])
    print(type(CurrentStates["robot_speed"]))
    return CurrentStates["robot_speed"]




app.include_router(table_mode_router,prefix="/tablemode")
app.include_router(event_mode_router, prefix="/eventMode")
app.include_router(robor_settings_router, prefix="/settings")