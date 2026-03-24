import websocket
import rospy
from std_msgs.msg import Float32,Int32, Bool
import rel
import redis
import asyncio
import json

r = redis.Redis(host="localhost", port="6379")

all_topics_state={
    "enable_motors":"false",
    "op_mode":1,
    "voltage_sensor":"0",
    "":"",
    "":""
}


def set_battery_state(data):
    global ws
    Current_states=json.loads(r.get("all_topics"))
    previous_battery_state=int(Current_states["voltage_sensor"])
    if int(data.data)== previous_battery_state:
        return
    try:
        print("Recieved new Battery Data")
        all_topics_state["voltage_sensor"]=int(data.data)
        Current_states=r.get("all_topics")
        r.set("all_topics",json.dumps(all_topics_state))
        print("Saved the new battery data succefully in redis")
    except Exception as e:
        print(f"Error saving data in redis in Voltage sensor callBack Function. The error is:{e}")
    try:
        msg_to_send=json.dumps(all_topics_state)
        ws.send(msg_to_send)
    except Exception as e:
        print(f"Error send new ws msg from set_battery_state due to {e}")

def set_op_mode(data):
    global ws
    try:
        all_topics_state["op_mode"]=str(data.data)
        r.set("all_topics", json.dumps(all_topics_state))
    except Exception as e:
        print("Error saving to Redis:", e)
    try:
        msg_to_ws=json.dumps(all_topics_state)
        ws.send(msg_to_ws)
        print("The websocket msg is sent successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from set_op_mode, the error is: {e}")

def set_motor_mode(data):
    global ws
    try:
        all_topics_state["enable_motors"]=str(data.data)
        r.set("all_topics", json.dumps(all_topics_state))
        print("saving motoer state",all_topics_state["enable_motors"],"of type",type(all_topics_state["enable_motors"]))
    except Exception as e:
        print("Error saving to Redis:", e)
    try:
        msg_to_ws=json.dumps(all_topics_state)
        ws.send(msg_to_ws)
        print("The websocket msg is sent successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from set_motor_mode, the error is: {e}")

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
    rospy.Subscriber("/enable_motors", Bool, set_motor_mode)
    rospy.Subscriber("/voltage_sensor", Float32, set_battery_state)
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

ws = websocket.WebSocketApp("ws://localhost:9876",on_open=on_open,on_message=on_message,
                            on_error=on_error,on_close=on_close)
if __name__ == "__main__":
    ws.run_forever(dispatcher=rel, reconnect=5)  
    listener()
