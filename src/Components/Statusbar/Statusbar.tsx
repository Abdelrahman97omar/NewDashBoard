import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BatteryIcon from "./batteryIcon";
import { useRosConnection } from "../../connection-provider";
import { useEffect, useState, useRef } from "react";
import lowBattery from "../../assets/icons/dashboard ui-07.png";
import midBattery from "../../assets/icons/dashboard ui-16.png";
import fullBattery from "../../assets/icons/dashboard ui-08.png";

import autobtn from "../../assets/icons/dashboard ui-09.png";
import manualbtn from "../../assets/icons/dashboard ui-10.png";
import motoron from "../../assets/icons/motor.png";
import motoroff from "../../assets/icons/dashboard ui-11.png";
import eventimg from "../../assets/icons/dashboard ui-13.png";
import tableimg from "../../assets/icons/dashboard ui-14.png";
import speedimg from "../../assets/icons/dashboard ui-15.png";
import localizationimg from "../../assets/icons/dashboard ui-17.png";
import emergencyOnBtn from "../../assets/icons/dashboard ui-18.png";
import emergencyOffBtn from "../../assets/icons/dashboard ui-19.png";

const StatusBar = () => {
  const { publishTopic, subscribeTopic, unsubscribeTopic } = useRosConnection();
  const [opMode, setOpMode] = useState("");
  const [MotorMode, setMotorMode] = useState("");
  const [BatteryLevel, setBatteryLeve] = useState("");
  const [emergencyState, setEmergencyState] = useState("");
  const [localizationState, setlocalizationState] = useState("");
  const [manualAutoMode, setmanualAutoMode] = useState("");
  const [robotSpeed, setRobotSpeed] = useState("");

  useEffect(() => {
    const get_current_states = async () => {
      const resp = await fetch(
        `http://${window.location.hostname}:8001/stausBar/States`,
        { method: "GET" }
      );
      const data = await resp.json();
      const all_topic_state = JSON.parse(data);

      const getUser = await fetch(
        `http://${window.location.hostname}:8001/getUser`
      );
      const username = await getUser.json(); 
      console.log(username);
      // ======================== Important Note ========================
        // the following topics are not published by default:
          /*
           1. /op_mode
           2. /manual_mode
           3. /speed
           */ 
      //=================================================================    
      // Check Event Mode
      if (all_topic_state["op_mode"] === "1") {
        setOpMode("Event");
      } else if (all_topic_state["op_mode"] === "0") {
        setOpMode("Table");
      } else {
        if (username === "duet") {
          setOpMode("Event");
          publishTopic("/op_mode", "std_msgs/Bool", {
            data: 1,
          });
        } else {
          setOpMode("Table");
          publishTopic("/op_mode", "std_msgs/Bool", {
            data: 0,
          });
        }
      }
      // Check motor enable
      if (all_topic_state["enable_motors"] == "True") {
        setMotorMode("ON");
      } else if (all_topic_state["enable_motors"] == "False") {
        setMotorMode("OFF");
      } else {
        setMotorMode("ON");
        publishTopic("/enable_motors", "std_msgs/Bool", {
          data: true,
        });
      }
      //check emergency state
      if (all_topic_state["emergency_state"] === "0") {
        setEmergencyState("pressed");
      } else if (all_topic_state["emergency_state"] === "1") {
        setEmergencyState("Released");
      }

      // Check manual mode
      if (all_topic_state["manual_auto_mode"] === "1") {
        setmanualAutoMode("Manual");
      } else {
        setmanualAutoMode("Auto");
      }

      // Set battery state
      if (
        all_topic_state["voltage_sensor"] == "23" ||
        all_topic_state["voltage_sensor"] == "22"
      ) {
        setBatteryLeve("High");
      } else if (
        all_topic_state["voltage_sensor"] == "21" ||
        all_topic_state["voltage_sensor"] == "20"
      ) {
        setBatteryLeve("Meduim");
      } else {
        setBatteryLeve("Low");
      }

      // Set localization state
      setlocalizationState(all_topic_state["localization_weight"]);
      const CurrentRobotSpeed = (
        Number(all_topic_state["robot_speed"]) * 0.007
      ).toFixed(2);
      setRobotSpeed(CurrentRobotSpeed);
    };
    get_current_states();
  }, []);

  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:9876`);
    ws.current.onopen = () => {
      console.log("Connected!");
    };

    ws.current.onmessage = (msg) => {
      const all_topic_state = JSON.parse(msg.data);
      console.log(
        "From statusbar, ws recived",
        all_topic_state,
        "of type",
        typeof all_topic_state
      );

      if (all_topic_state["op_mode"] === "1") {
        setOpMode("Event");
      } else {
        setOpMode("Table");
      }

      if (all_topic_state["enable_motors"] == "True") {
        setMotorMode("ON");
      } else {
        setMotorMode("OFF");
      }

      if (all_topic_state["emergency_state"] === "0") {
        setEmergencyState("pressed");
      } else {
        setEmergencyState("Released");
      }

      if (all_topic_state["manual_auto_mode"] === "1") {
        setmanualAutoMode("Manual");
      } else {
        setmanualAutoMode("Auto");
      }

      if (
        all_topic_state["voltage_sensor"] == "23" ||
        all_topic_state["voltage_sensor"] == "22"
      ) {
        setBatteryLeve("High");
      } else if (
        all_topic_state["voltage_sensor"] == "21" ||
        all_topic_state["voltage_sensor"] == "20"
      ) {
        setBatteryLeve("Meduim");
      } else {
        setBatteryLeve("Low");
      }

      setlocalizationState(all_topic_state["localization_weight"]);

      const CurrentRobotSpeed = (
        Number(all_topic_state["robot_speed"]) * 0.007
      ).toFixed(2);
      setRobotSpeed(CurrentRobotSpeed);
    };
    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <>
      {/* Done */}
      <div className="Cgray statusbarlayout">
        <div className="flex flex-col justify-around items-center">
          <img
            src={
              BatteryLevel === "High"
                ? fullBattery
                : BatteryLevel === "Miduem"
                ? midBattery
                : lowBattery
            }
          ></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2">Battery</p>
            <p> {BatteryLevel ? BatteryLevel : "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="Cgray statusbarlayout">
        <div className="flex flex-col justify-around items-center">
          <img src={MotorMode === "ON" ? motoron : motoroff}></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2">Motors</p>
            <p> {MotorMode ? MotorMode : "N/A"}</p>
          </div>
        </div>
      </div>
      {/* Done */}
      <div className="Cgray statusbarlayout">
        <div className="flex flex-col justify-around items-center">
          <img
            src={
              emergencyState === "pressed" ? emergencyOnBtn : emergencyOffBtn
            }
          ></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2">Emergency</p>
            <p> {emergencyState ? emergencyState : "N/A"}</p>
          </div>
        </div>
      </div>
      {/* Done */}
      <div className="Cgray statusbarlayout">
        <div className="flex flex-col justify-around items-center">
          <img src={speedimg}></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2">Speed</p>
            <p> {robotSpeed ? robotSpeed : "N/A"}</p>
          </div>
        </div>
      </div>
      {/* Done */}
      <div className="Cgray statusbarlayout">
        <div className="flex flex-col justify-around items-center">
          <img src={localizationimg}></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2">Localization</p>
            <p> {localizationState ? localizationState : "N/A"}</p>
          </div>
        </div>
      </div>
      {/* Done */}
      <div className="Cgray statusbarlayout">
        <div className="flex flex-col  items-center">
          <img
            className="mt-7 mb-4"
            src={manualAutoMode === "Manual" ? manualbtn : autobtn}
          ></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2 text-center">Mode</p>
            <p> {manualAutoMode ? manualAutoMode : "N/A"}</p>
          </div>
        </div>
      </div>
      {/* Done */}
      <div className="Cgray statusbarlayout">
        <div className="flex flex-col  items-center">
          <img
            className="mt-7 mb-4"
            src={opMode === "Event" ? eventimg : tableimg}
          ></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2 text-center">
              Operation Mode
            </p>
            <p> {opMode ? opMode : "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="Cgray statusbarlayout">
        <div className="flex flex-col justify-around items-center">
          <img src={lowBattery}></img>
          <div className="flex flex-col justify-around items-center">
            <p className="font-bold text-2xl mb-2">Location</p>
            <p> {opMode ? opMode : "N/A"}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default StatusBar;
