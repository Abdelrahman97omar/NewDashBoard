from fastapi import APIRouter
import redis 
from os import listdir
import os
from os.path import isfile, join


router = APIRouter()
r =redis.Redis(host="localhost",port="6379")

@router.get("/getAllPointsFiles")
async def get_event_points_list():
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

@router.get("/getPointsPool/{filenumber}")
async def get_points_pool(filenumber:int):
    with open(f"/home/{os.environ.get('USER')}/Desktop/points/points{filenumber}.txt") as f:
        points= f.read()
        print(points)
        print(type(points))

@router.put("/addNewPoint")
async def get_event_points_list():
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
    if not file_list:
        new_file_number=f"points1.txt"
        with open(f"{file_path}/{new_file_number}", "w") as f:
            print("Creating new file",new_file_number)
            f.write("")
            f.close()
            return
    else:
        new_file_number=f"points{file_list[-1]+1}.txt"
        with open(f"{file_path}/{new_file_number}", "w") as f:
            print("Creating new file",new_file_number)
            f.write("")
            f.close()

    
@router.delete("/deletePoint/{pointNumber}")
async def remove_event_points_file(pointNumber):
    import os
    print(pointNumber)
    file_path = f"/home/{os.environ.get('USER')}/Desktop/points"
    os.remove(f"{file_path}/points{pointNumber}.txt") 

@router.patch("/clearPoint/{pointNumber}")
async def clear_points_file(pointNumber):
    import os
    file_path = f"/home/{os.environ.get('USER')}/Desktop/points"
    open(f"{file_path}/points{pointNumber}.txt", 'w').close()
