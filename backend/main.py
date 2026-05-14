from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tableModeApi import router as table_mode_router 
from eventModeApi import router as event_mode_router 
from robotsettingsApi import router as robor_settings_router
import redis 
import os
from fastapi.responses import FileResponse
from fastapi import HTTPException

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

@app.get("/getUser")
async def returnUserName():
    """
    This endpoint will return the UseName - duet - mozo ... 
    """  
    print("the robot name is:",os.getenv("USER"))
    return os.getenv("USER")

@app.get("/robotSpeed")
async def returnRobotSpeed():
    robotName = os.getenv("USER")
    print("Robot name is:", robotName)
    try:
        with open(f"/home/{robotName}/.bash_profile", "r") as f:
            print("File opened successfully")
            for line in f:
                line = line.strip()
                if line.startswith("export ROBOT_MAX_SPEED="):
                    return line.split("=", 1)[1]
        return None
    except FileNotFoundError as e:
        print(f"File not found: {e}")
        return None
    except PermissionError as e:        
        print(f"Permission denied: {e}")
        return None
    except Exception as e:              
        print(f"Unexpected error: {e}")
        return None

@app.get("/downloadLogs")
def download_logs():
    user=os.getenv("USER")
    file_path = f"/home/{user}/.logs/latest-stats.pdf"
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404, 
            detail="Log file not found"
        )
    return FileResponse(
        file_path,
        filename="latest-stats.pdf"
    )

app.include_router(table_mode_router,prefix="/tablemode")
app.include_router(event_mode_router, prefix="/eventMode")
app.include_router(robor_settings_router, prefix="/settings")