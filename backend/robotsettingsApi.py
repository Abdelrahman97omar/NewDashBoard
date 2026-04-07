from fastapi import APIRouter
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
        if (networkname != None) or networkname != '':
            network_list.append(networkname.strip())

    network_list=network_list[1:-1]
    return network_list

