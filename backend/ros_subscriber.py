import websocket
import rospy
from std_msgs.msg import Int32
import rel
import redis
import asyncio
import json
# import websockets
# import threading
# from websockets.sync.client import connect



r = redis.Redis(host="localhost", port="6379")



def set_op_mode(data):
    global ws
    print("Received ROS data:", data.data)

    try:
        r.set("op_mode", data.data)
        print("op_mode state saved in Redis successfully")
    except Exception as e:
        print("Error saving to Redis:", e)
    mymsg=str(data.data)
    mymsg = {"/op_mode":f"{data.data}"}
    mymsg= json.dumps(mymsg)
    ws.send(mymsg)


def listener():
    rospy.init_node('listener', anonymous=True)
    rospy.Subscriber("/op_mode", Int32, set_op_mode)
    rospy.spin()


def on_message(ws, message):
    print(f"<<< {message}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    print("Opened connection")
    ws.send("Hello, server!")
    print(f">>> Hello, server!")

ws = websocket.WebSocketApp("ws://localhost:9876",
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)
if __name__ == "__main__":
    ws.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to rel for automatic reconnect
    listener()
