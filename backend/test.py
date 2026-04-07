# importing the subprocess module
import subprocess
import json

# using the check_output() for having the network term retrieval
# devices = subprocess.check_output("echo 246810 |sudo -S nmcli device wifi | grep SSID")

# devices =  subprocess.check_output(
#     "nmcli -f SSID device wifi",
#     stderr=subprocess.STDOUT,
#     shell=False)
devices = subprocess.check_output(
    ["nmcli", "-f", "SSID", "device", "wifi"],
    stderr=subprocess.STDOUT,
    shell=False
)
devices=devices.decode("utf-8")
devices=devices.split('\n')
network_list=[]

for networkname in devices:
    network_list.append(networkname.strip())

network_list=network_list[1:-1]
print(network_list)
print(type(devices))
