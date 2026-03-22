import websocket
import rospy
from std_msgs.msg import Int32
import rel
import redis
import asyncio
import json

r = redis.Redis(host="localhost", port="6379")

def set_op_mode(data):
    global ws
    # print("Received ROS data:", data.data)
    try:
        r.set("op_mode", data.data)
        # print("op_mode state saved in Redis successfully as", r.get("op_mode"))
    except Exception as e:
        print("Error saving to Redis:", e)
    try:
        mymsg=str(data.data)
        mymsg = {"/op_mode":f"{data.data}"}
        mymsg= json.dumps(mymsg)
        ws.send(mymsg)
        print("The websocket msg is sent successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from set_op_mode, the error is: {e}")

def set_manual_auto_mode(data):
    global ws
    print("Received ROS data:", data.data)
    try:
        r.set("manual_flag", data.data)
        print("manual_flag state saved in Redis successfully")
    except Exception as e:
        print("Error saving to Redis:", e)
    try:
        mymsg=str(data.data)
        mymsg = {"/manual_flag":f"{data.data}"}
        mymsg= json.dumps(mymsg)
        ws.send(mymsg)
        print("The websocket msg is sent successfully..")
    except:
        print("failed to send websocket msg from manual_flag")

def listener():
    rospy.init_node('listener', anonymous=True)
    rospy.Subscriber("/op_mode", Int32, set_op_mode)
    # rospy.Subscriber("/manual_flag", Int32, set_manual_auto_mode)
    rospy.spin()


def on_message(ws, message):
    print("ws client in ros subscriber recived new msg")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    print("Opened connection")
    mymsg= {"Server State": "Connected"}
    mymsg= json.dumps(mymsg)
    ws.send(mymsg)
    print(f">>> Hello, server!")

ws = websocket.WebSocketApp("ws://localhost:9876",
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)
if __name__ == "__main__":
    ws.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to rel for automatic reconnect
    listener()
