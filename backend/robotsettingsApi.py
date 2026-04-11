from fastapi import APIRouter ,Body, HTTPException
from os import listdir
router = APIRouter()
import subprocess

@router.get("/wifi/getNetworks")
async def get_wifi_networks():
    try:
        devices = subprocess.check_output(
            ["nmcli", "-t","-f", "SSID", "device", "wifi"],
            stderr=subprocess.STDOUT,
            shell=False
        )
    except Exception as e:
        print("Couldn't find any network due to:",e)
        return[]
    devices=devices.decode("utf-8")
    devices=devices.split('\n')
    network_list=[]
    for networkname in devices:
        if (networkname != None) and networkname !='':
            network_list.append(networkname.strip())

    network_list=network_list[1:-1]
    return network_list



@router.put("/wifi/connect")
async def connect_to_wifi(commingData: dict = Body(...)):
    ssid = commingData.get("ssid")
    password = commingData.get("password")
    if not ssid or not password:
        raise HTTPException(status_code=400, detail="SSID and password are required")
    try:
        subprocess.run(
            ["nmcli", "d", "wifi", "connect", ssid, "password", password],
            check=True,
            capture_output=True,
            text=True
        )
        return {"message": "Connected successfully"}
    except subprocess.CalledProcessError as e:
        print("NMCLI ERROR:", e.stderr)
        raise HTTPException(
            status_code=400,
            detail=f"Failed to connect to WiFi: {e.stderr.strip()}"
        )