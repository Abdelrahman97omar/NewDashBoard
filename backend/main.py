from fastapi import FastAPI, Body
import redis 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tableModeApi import router as table_mode_router  # Import the router

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

@app.get("/eventMode/getPoints/list")
async def get_event_points_list():
    from os import listdir
    import os
    from os.path import isfile, join
    file_list=[]
    file_path = f"/home/{os.environ.get('USER')}/Desktop/points"
    pointFiles = [f for f in listdir(file_path) if isfile(join(file_path, f))]
    for file in pointFiles:
        if "points" in file and "txt" in file:
            try:
                file=file.split(".txt")[0]
                file=file.split("points")[1]
                file_number=int(file)
                file_list.append(file_number)
            except Exception as e:
                print("error:" ,e)
    file_list.sort()
    return file_list


app.include_router(table_mode_router)