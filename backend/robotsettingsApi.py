from fastapi import APIRouter
import redis 
from os import listdir
import os
import subprocess
from os.path import isfile, join
router = APIRouter()


@router.get("/wifi/getNetworks")
async def get_wifi_networks():
    result = subprocess.check_output(
        ["nmcli", "-t", "-f", "SSID,SIGNAL,SECURITY", "dev", "wifi"],
        encoding="utf-8"
    )
    networks = []
    for line in result.strip().split("\n"):
        ssid, signal, security = line.split(":")
        networks.append({
            "ssid": ssid
        })
    print(networks)
    return networks


