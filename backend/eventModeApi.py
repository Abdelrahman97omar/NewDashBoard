from fastapi import APIRouter
import redis 
from fastapi import Body
import math
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
    # all_points_list=[]
    all_points_list=dict()
    counter=1
    with open(f"/home/{os.environ.get('USER')}/Desktop/points/points{filenumber}.txt") as f:
        for line in f:
            the_new_line_points=[]
            x,y,seta,Qx,Qy,Qz,Qw=line.split(",")
            the_new_line_points.append(round(float(x.strip()), 2))
            the_new_line_points.append(round(float(y.strip()), 2))
            the_new_line_points.append(round(float(seta.strip()), 2))
            # the_new_line_points.append(y.strip())
            # the_new_line_points.append(seta.strip())
            all_points_list[f"{counter}"]=(the_new_line_points)
            counter=counter+1
    return all_points_list

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



@router.patch("/editPoint/{filenumber}")
async def edit_point(filenumber: str, incomingData: dict = Body(...)):
    print("the current file numbe ris:" ,filenumber)
    print(incomingData)
    file_path = f"/home/{os.environ.get('USER')}/Desktop/points/points{filenumber}.txt"
    cleaned_lines = []
    try:
        with open(file=file_path, encoding="utf-8") as f:
            lines=f.readlines()
            for line in lines:
                cleaned_lines.append(line.strip())
            print(cleaned_lines)
    except Exception as e:
        print("Error reading lines to edit it due to:",e)

    Qx="0.0"
    Qy="0.0"
    Qz = math.sin(float(incomingData['Seta']) / 2)
    Qw = math.cos(float(incomingData['Seta']) / 2)
    index = incomingData['choosenpointsPool']
    cleaned_lines[index] = (
        incomingData['X'] + "," +
        incomingData['Y'] + "," +
        incomingData['Seta'] + "," +
        Qx + "," +
        Qy + "," +
        Qz + "," +
        Qw + "," 
    )
    try:
        with open(file_path, "w") as f:
            for x in cleaned_lines:
                f.write(x+'\n')
    except Exception as e:
        print("Error editing line due to:",e)

