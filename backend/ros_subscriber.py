import websocket
import rospy
from std_msgs.msg import Float32,Int32, Bool,String
from nav_msgs.msg import Odometry
from tf.transformations import euler_from_quaternion
import rel
import redis
import asyncio
import json
import time

r = redis.Redis(host="localhost", port="6379")
global ws

all_topics_state={
    "enable_motors":"",
    "op_mode":None,
    "voltage_sensor":"",
    "emergency_state":"",
    "localization_weight":"",
    "manual-auto_mode":"",
    "robot_speed":"",
}


def set_battery_state(data):
    global ws
    print("Enetering get battery state")
    try:
        Current_states=json.loads(r.get("all_topics"))
        previous_battery_state=int(Current_states["voltage_sensor"])
    except Exception as e:
        print("Error fetching the latest battery state due to:",e)
        return
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
    print("Received ROS data:", str(data.data))
    try:
        all_topics_state["manual-auto_mode"]=str(data.data)
        r.set("all_topics", json.dumps(all_topics_state))
    except Exception as e:
        print("Error saving manual-auto_mode to Redis:", e)
    try:
        msg_to_ws=json.dumps(all_topics_state)
        ws.send(msg_to_ws)
        print("The websocket msg is sent successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from set_op_mode, the error is: {e}")

def set_emergency_state(data):
    global ws
    try:
        all_topics_state["emergency_state"]=str(data.data)
        r.set("all_topics", json.dumps(all_topics_state))
        print("Saved emergency state to redis")
    except Exception as e:
        print("Error saving to Redis:", e)
    try:
        msg_to_ws=json.dumps(all_topics_state)
        ws.send(msg_to_ws)
        print("The websocket msg is sent emergenyc state successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from set_emergency_state, the error is: {e}")

def set_localization_weight(data):
    global ws
    try:
        all_topics_state["localization_weight"]=data.data
        r.set("all_topics", json.dumps(all_topics_state))
        print("saved localization_weight in redis")
    except Exception as e:
        print("Error saving to Redis:", e)
    try:
        msg_to_ws=json.dumps(all_topics_state)
        ws.send(msg_to_ws)
        print("The websocket msg localization_weight is sent successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from localization_weight, the error is: {e}")

def set_robot_speed(data):
    try:
        all_topics_state["robot_speed"]=str(data.data)
        r.set("all_topics", json.dumps(all_topics_state))
    except Exception as e:
        print("There is an error in setting robot speed in redis:",e)
    try:
        msg_to_ws=json.dumps(all_topics_state)
        ws.send(msg_to_ws)
        print("The websocket msg is sent successfully..")
    except Exception as e:
        print(f"failed to send websocket msg from set_robot_speed, the error is: {e}")

# def get_robot_odom(data):
#     x=data.pose.pose.position.x
#     y=data.pose.pose.position.y
#     orientation_q = data.pose.pose.orientation
#     orientation_list = [orientation_q.x, orientation_q.y,orientation_q.z, orientation_q.w]
#     (roll, pitch, yaw) = euler_from_quaternion(orientation_list)
#     yaw=yaw * 57.2958
#     rospy.loginfo("Robot Theta (yaw): %f", yaw)



def listener():
    rospy.init_node('listener', anonymous=True)
    rospy.Subscriber("/op_mode", Int32, set_op_mode)
    rospy.Subscriber("/enable_motors", Bool, set_motor_mode)
    rospy.Subscriber("/emergency_button", Int32, set_emergency_state)
    rospy.Subscriber("/localization_weight", String, set_localization_weight)
    rospy.Subscriber("/manual_flag", Int32, set_manual_auto_mode)
    rospy.Subscriber("/set_speed", Float32, set_robot_speed)
    # rospy.Subscriber("/slamware_ros_sdk_server_node/odom", Odometry,get_robot_odom )
    rospy.Subscriber("/voltage_sensor", Float32, set_battery_state)
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

def connect_ws():
    global ws
    try:
        ws = websocket.WebSocketApp("ws://localhost:9876",on_open=on_open,on_message=on_message,
                            on_error=on_error,on_close=on_close)
        return False
    except:
        print("couldn't connect")
        return True
if __name__ == "__main__":
    connect_ws()
    ws.run_forever(dispatcher=rel, reconnect=5)  
    listener()
